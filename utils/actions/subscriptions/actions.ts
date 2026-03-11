'use server';

import Stripe from "stripe";
import { stripe, type PlanType } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getSubscriptionStatus(): Promise<{
  plan: PlanType;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      plan: "free",
      status: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeCustomerId: null,
    };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!subscription) {
    return {
      plan: "free",
      status: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeCustomerId: null,
    };
  }

  // Lifetime never expires
  if (subscription.plan_type === "lifetime") {
    return {
      plan: "lifetime",
      status: "active",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeCustomerId: subscription.stripe_customer_id,
    };
  }

  // Check if pro subscription is still active
  if (
    subscription.plan_type === "pro" &&
    subscription.subscription_status === "active"
  ) {
    return {
      plan: "pro",
      status: subscription.subscription_status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      stripeCustomerId: subscription.stripe_customer_id,
    };
  }

  return {
    plan: "free",
    status: subscription.subscription_status,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: false,
    stripeCustomerId: subscription.stripe_customer_id,
  };
}

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Check if user already has a stripe customer ID
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = subscription?.stripe_customer_id;

  // Create new customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });
    customerId = customer.id;

    // Upsert subscription record with customer ID
    await supabase.from("subscriptions").upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      subscription_plan: "free",
      plan_type: "free",
      updated_at: new Date().toISOString(),
    });
  }

  // Determine if this is a one-time or subscription payment
  const lifetimePriceId = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;
  const isLifetime = priceId === lifetimePriceId;

  const sessionParams: Record<string, unknown> = {
    customer: customerId,
    success_url: `${siteUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: `${siteUrl}/dashboard/billing?canceled=true`,
    metadata: {
      supabase_user_id: user.id,
    },
  };

  if (isLifetime) {
    // One-time payment for lifetime
    Object.assign(sessionParams, {
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
    });
  } else {
    // Recurring subscription
    Object.assign(sessionParams, {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    });
  }

  const session = await stripe.checkout.sessions.create(
    sessionParams as Stripe.Checkout.SessionCreateParams
  );

  if (session.url) {
    redirect(session.url);
  }
}

export async function createBillingPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    redirect("/dashboard/settings");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${siteUrl}/dashboard/billing`,
  });

  redirect(session.url);
}

export async function cancelSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id, plan_type")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_subscription_id) {
    return { error: "No active subscription found" };
  }

  if (subscription.plan_type === "lifetime") {
    return { error: "Lifetime plans cannot be canceled" };
  }

  // Cancel at period end (not immediately)
  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  return { success: true };
}

export interface InvoiceItem {
  id: string;
  number: string | null;
  status: string | null;
  amount_due: number;
  amount_paid: number;
  currency: string;
  created: number;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  period_start: number;
  period_end: number;
}

export async function getInvoices(): Promise<InvoiceItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_customer_id) return [];

  const invoices = await stripe.invoices.list({
    customer: subscription.stripe_customer_id,
    limit: 24,
  });

  return invoices.data.map((inv) => ({
    id: inv.id,
    number: inv.number,
    status: inv.status,
    amount_due: inv.amount_due,
    amount_paid: inv.amount_paid,
    currency: inv.currency,
    created: inv.created,
    hosted_invoice_url: inv.hosted_invoice_url,
    invoice_pdf: inv.invoice_pdf,
    period_start: inv.period_start,
    period_end: inv.period_end,
  }));
}

export async function reactivateSubscription(): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id, plan_type, cancel_at_period_end")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_subscription_id) {
    return { error: "No subscription found" };
  }

  if (!subscription.cancel_at_period_end) {
    return { error: "Subscription is not scheduled for cancellation" };
  }

  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: false,
  });

  await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  return { success: true };
}
