"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Sparkles,
  Crown,
  Zap,
  ArrowRight,
  ArrowLeft,
  Shield,
  Download,
  FileText,
  Briefcase,
  Bot,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createCheckoutSession, getSubscriptionStatus } from "@/utils/actions/subscriptions/actions";
import Link from "next/link";
import type { PlanType } from "@/lib/stripe";

const proMonthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!;
const proAnnualPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID!;
const lifetimePriceId = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID!;

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const sub = await getSubscriptionStatus();
        setCurrentPlan(sub.plan);
      } catch (e) {
        console.error(e);
      } finally {
        setPageLoading(false);
      }
    }
    load();
  }, []);

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);
    try {
      await createCheckoutSession(priceId);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(null);
    }
  };

  const isPaid = currentPlan === "pro" || currentPlan === "lifetime";

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out the platform",
      price: "$0",
      period: "forever",
      icon: Zap,
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-500",
      features: [
        { text: "1 CV download", icon: Download },
        { text: "1 cover letter download", icon: FileText },
        { text: "10 job applications", icon: Briefcase },
        { text: "Full CV builder access", icon: Check },
      ],
      cta: currentPlan === "free" ? "Current Plan" : "Free Plan",
      disabled: true,
      priceId: null,
      highlight: false,
      current: currentPlan === "free",
    },
    {
      name: "Pro",
      description: "Everything unlimited for serious job seekers",
      price: billing === "monthly" ? "$19" : "$190",
      period: billing === "monthly" ? "/mo" : "/yr",
      savings: billing === "annual" ? "Save $38" : null,
      icon: Sparkles,
      iconBg: "bg-[#5b6949]/10",
      iconColor: "text-[#5b6949]",
      features: [
        { text: "Unlimited CV downloads", icon: Download },
        { text: "Unlimited cover letters", icon: FileText },
        { text: "Unlimited job applications", icon: Briefcase },
        { text: "All platform features", icon: Check },
      ],
      cta: currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro",
      disabled: currentPlan === "pro" || currentPlan === "lifetime",
      priceId: billing === "monthly" ? proMonthlyPriceId : proAnnualPriceId,
      highlight: true,
      current: currentPlan === "pro",
    },
    {
      name: "Lifetime",
      description: "One payment, unlimited forever",
      price: "$149",
      period: "one-time",
      icon: Crown,
      iconBg: "bg-zinc-900/10",
      iconColor: "text-zinc-900",
      features: [
        { text: "Everything in Pro, forever", icon: Check },
        { text: "Smart Apply (coming soon)", icon: Bot },
        { text: "All future features included", icon: Sparkles },
        { text: "Priority support", icon: Headphones },
      ],
      cta: currentPlan === "lifetime" ? "Current Plan" : "Get Lifetime",
      disabled: currentPlan === "lifetime",
      priceId: lifetimePriceId,
      highlight: false,
      current: currentPlan === "lifetime",
    },
  ];

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-200 border-t-[#5b6949] rounded-full animate-spin" />
          <span className="text-sm text-zinc-500">Loading plans...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7db_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5b6949]/10 border border-[#5b6949]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5b6949]" />
            <span className="text-xs font-semibold text-[#5b6949] uppercase tracking-wide">
              Pricing
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Supercharge your job search
          </h1>
          <p className="text-zinc-500 max-w-lg mx-auto text-sm sm:text-base">
            Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center pt-4">
            <div className="inline-flex items-center bg-zinc-100 rounded-xl p-1 border border-zinc-200">
              <button
                onClick={() => setBilling("monthly")}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  billing === "monthly"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5",
                  billing === "annual"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Annual
                <span className="text-[10px] font-bold text-[#5b6949] bg-[#5b6949]/10 px-1.5 py-0.5 rounded-full">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border bg-white flex flex-col transition-all duration-300",
                plan.highlight
                  ? "border-[#5b6949] shadow-xl shadow-[#5b6949]/8 md:scale-[1.03]"
                  : plan.current
                  ? "border-[#5b6949]/30 shadow-md"
                  : "border-zinc-200 hover:border-zinc-300 hover:shadow-lg"
              )}
            >
              {/* Popular badge */}
              {plan.highlight && !plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full text-[11px] font-bold bg-[#5b6949] text-white uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Current plan badge */}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full text-[11px] font-bold bg-zinc-900 text-white uppercase tracking-wider shadow-sm">
                    Your Plan
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Plan header */}
                <div className="mb-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        plan.iconBg
                      )}
                    >
                      <plan.icon className={cn("w-5 h-5", plan.iconColor)} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">
                        {plan.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-zinc-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-zinc-900 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-zinc-400">
                      {plan.period}
                    </span>
                  </div>
                  {plan.savings && (
                    <span className="inline-block mt-2 text-xs font-semibold text-[#5b6949] bg-[#5b6949]/10 px-2.5 py-1 rounded-full">
                      {plan.savings}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                          plan.highlight
                            ? "bg-[#5b6949]/10"
                            : "bg-zinc-50"
                        )}
                      >
                        <feature.icon
                          className={cn(
                            "w-3.5 h-3.5",
                            plan.highlight ? "text-[#5b6949]" : "text-zinc-400"
                          )}
                        />
                      </div>
                      <span className="text-sm text-zinc-600">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => plan.priceId && handleCheckout(plan.priceId)}
                  disabled={plan.disabled || loading === plan.priceId}
                  className={cn(
                    "w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200",
                    plan.current
                      ? "bg-zinc-100 text-zinc-500 cursor-default hover:bg-zinc-100"
                      : plan.highlight
                      ? "bg-[#5b6949] text-white hover:bg-[#4a573a] shadow-md shadow-[#5b6949]/20 hover:shadow-lg hover:shadow-[#5b6949]/25"
                      : plan.disabled
                      ? "bg-zinc-100 text-zinc-400 cursor-default hover:bg-zinc-100"
                      : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md hover:shadow-lg"
                  )}
                >
                  {loading === plan.priceId ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {plan.current && <Check className="w-4 h-4" />}
                      {plan.cta}
                      {!plan.disabled && !plan.current && (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Secure checkout via Stripe</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Instant access</span>
          </div>
        </div>

        {/* Feature Matrix */}
        <div className="mt-16 rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
            <h3 className="text-lg font-bold text-zinc-900">
              Compare all features
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              See what&apos;s included in each plan
            </p>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-4 px-6 py-3.5 border-b border-zinc-100 bg-zinc-50/30">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Feature
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center">
              Free
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#5b6949] text-center">
              Pro
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 text-center">
              Lifetime
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {[
              { feature: "CV Builder", free: true, pro: true, lifetime: true },
              { feature: "CV Downloads", free: "1", pro: "Unlimited", lifetime: "Unlimited" },
              { feature: "Cover Letter Downloads", free: "1", pro: "Unlimited", lifetime: "Unlimited" },
              { feature: "Job Applications", free: "10", pro: "Unlimited", lifetime: "Unlimited" },
              { feature: "Follow-up Emails", free: true, pro: true, lifetime: true },
              { feature: "Smart Apply", free: false, pro: false, lifetime: true },
              { feature: "Priority Support", free: false, pro: false, lifetime: true },
              { feature: "Future Features", free: false, pro: true, lifetime: true },
            ].map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-4 px-6 py-3.5 text-sm hover:bg-zinc-50/50 transition-colors"
              >
                <div className="font-medium text-zinc-700">{row.feature}</div>
                {[row.free, row.pro, row.lifetime].map((val, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {val === true ? (
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        i === 1 ? "bg-[#5b6949]/10" : "bg-zinc-100"
                      )}>
                        <Check className={cn(
                          "w-3 h-3",
                          i === 1 ? "text-[#5b6949]" : "text-zinc-400"
                        )} />
                      </div>
                    ) : val === false ? (
                      <span className="text-zinc-300">—</span>
                    ) : (
                      <span className={cn(
                        "text-sm font-medium",
                        i === 1 ? "text-[#5b6949]" : "text-zinc-600"
                      )}>
                        {val}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
