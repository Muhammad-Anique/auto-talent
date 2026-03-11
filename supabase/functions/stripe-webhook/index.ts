import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Supabase automatically injects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

// Load Stripe secrets from app_config table (since secrets API requires elevated token scope)
async function getConfig(key: string): Promise<string> {
  // Try env var first (if secrets are set), then fall back to DB
  const envVal = Deno.env.get(key);
  if (envVal) return envVal;

  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) {
    throw new Error(`Missing config: ${key}`);
  }
  return data.value;
}

// Cache config on first request
let _stripe: Stripe | null = null;
let _webhookSecret: string | null = null;
let _lifetimePriceId: string | null = null;

async function getStripe(): Promise<Stripe> {
  if (!_stripe) {
    const secretKey = await getConfig("STRIPE_SECRET_KEY");
    _stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return _stripe;
}

async function getWebhookSecret(): Promise<string> {
  if (!_webhookSecret) {
    _webhookSecret = await getConfig("STRIPE_WEBHOOK_SECRET");
  }
  return _webhookSecret;
}

async function getLifetimePriceId(): Promise<string | null> {
  if (!_lifetimePriceId) {
    try {
      _lifetimePriceId = await getConfig("STRIPE_LIFETIME_PRICE_ID");
    } catch {
      _lifetimePriceId = null;
    }
  }
  return _lifetimePriceId;
}

function getPeriodEnd(subscription: any): string {
  const periodEnd =
    subscription.items?.data?.[0]?.current_period_end ??
    subscription.current_period_end;
  return periodEnd
    ? new Date(periodEnd * 1000).toISOString()
    : new Date().toISOString();
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripe = await getStripe();
  const webhookSecret = await getWebhookSecret();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (!userId) {
          console.error("No supabase_user_id in session metadata");
          break;
        }

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await supabase.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            subscription_plan: "pro",
            plan_type: "pro",
            subscription_status: subscription.status,
            stripe_price_id: subscription.items.data[0]?.price.id,
            current_period_end: getPeriodEnd(subscription),
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          });
        } else if (session.mode === "payment") {
          await supabase.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: null,
            subscription_plan: "lifetime",
            plan_type: "lifetime",
            subscription_status: "active",
            stripe_price_id: await getLifetimePriceId(),
            current_period_end: null,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        const updateData = {
          subscription_status: subscription.status,
          current_period_end: getPeriodEnd(subscription),
          cancel_at_period_end: subscription.cancel_at_period_end,
          stripe_price_id: subscription.items.data[0]?.price.id,
          updated_at: new Date().toISOString(),
        };

        if (!userId) {
          const { data: sub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_customer_id", subscription.customer as string)
            .single();

          if (!sub) break;

          await supabase
            .from("subscriptions")
            .update(updateData)
            .eq("user_id", sub.user_id);
        } else {
          await supabase
            .from("subscriptions")
            .update(updateData)
            .eq("user_id", userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: sub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();

        if (sub) {
          await supabase
            .from("subscriptions")
            .update({
              subscription_plan: "free",
              plan_type: "free",
              subscription_status: "canceled",
              stripe_subscription_id: null,
              current_period_end: null,
              cancel_at_period_end: false,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", sub.user_id);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subRef =
          invoice.parent?.subscription_details?.subscription ??
          invoice.subscription;

        if (invoice.billing_reason === "subscription_cycle" && subRef) {
          const subscriptionId =
            typeof subRef === "string" ? subRef : subRef.id;
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          const { data: sub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", subscriptionId)
            .single();

          if (sub) {
            await supabase
              .from("subscriptions")
              .update({
                subscription_status: "active",
                current_period_end: getPeriodEnd(subscription),
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", sub.user_id);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subRef =
          invoice.parent?.subscription_details?.subscription ??
          invoice.subscription;

        if (subRef) {
          const subscriptionId =
            typeof subRef === "string" ? subRef : subRef.id;

          const { data: sub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", subscriptionId)
            .single();

          if (sub) {
            await supabase
              .from("subscriptions")
              .update({
                subscription_status: "past_due",
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", sub.user_id);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
