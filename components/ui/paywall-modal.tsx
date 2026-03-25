"use client";

import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Crown,
  Check,
  ArrowRight,
  Shield,
  Zap,
  Download,
  FileText,
  Briefcase,
  Bot,
  Headphones,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/utils/actions/subscriptions/actions";

const proMonthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID!;
const proAnnualPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID!;
const lifetimePriceId = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID!;

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
  limitMessage?: string;
}

export function PaywallModal({
  open,
  onClose,
  feature = "this feature",
  limitMessage,
}: PaywallModalProps) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [geo, setGeo] = useState<{ currency: string; symbol: string; symbolAfter: boolean; pro: number; lifetime: number } | null>(null);

  useEffect(() => {
    if (open) {
      fetch("/api/geo-pricing")
        .then((r) => r.json())
        .then((data) => setGeo(data))
        .catch(() => setGeo({ currency: "USD", symbol: "$", symbolAfter: false, pro: 19, lifetime: 149 }));
    }
  }, [open]);

  const formatPrice = (amount: number) => {
    if (!geo) return `$${amount}`;
    return geo.symbolAfter ? `${amount} ${geo.symbol}` : `${geo.symbol}${amount}`;
  };

  if (!open) return null;

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);
    try {
      await createCheckoutSession(priceId, geo?.currency || "USD");
    } catch (e) {
      console.error("Checkout error:", e);
      setLoading(null);
    }
  };

  const proMonthly = geo?.pro ?? 19;
  const proAnnual = proMonthly * 10;
  const annualSavings = proMonthly * 2;
  const proPrice = billing === "monthly" ? formatPrice(proMonthly) : formatPrice(proAnnual);
  const proPeriod = billing === "monthly" ? "/mo" : "/yr";
  const proPriceId = billing === "monthly" ? proMonthlyPriceId : proAnnualPriceId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700 transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#5b6949] to-[#3d4a30] px-8 pt-8 pb-10 text-white overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -right-4 -bottom-10 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                Free Plan Limit
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Unlock {feature}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              {limitMessage ||
                `You've reached your free plan limit. Upgrade to Pro for unlimited access to ${feature} and all platform features.`}
            </p>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center pt-6 pb-2 px-8">
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

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 pb-6 pt-4">
          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-[#5b6949] bg-white shadow-lg shadow-[#5b6949]/10 flex flex-col p-5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full text-[10px] font-bold bg-[#5b6949] text-white uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-4 mt-1">
              <div className="w-9 h-9 rounded-xl bg-[#5b6949]/10 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-[#5b6949]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Pro</h3>
                <p className="text-[11px] text-zinc-400">Unlimited access</p>
              </div>
            </div>

            <div className="mb-5 pb-4 border-b border-zinc-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-zinc-900">
                  {proPrice}
                </span>
                <span className="text-sm font-medium text-zinc-400">
                  {proPeriod}
                </span>
              </div>
              {billing === "annual" && (
                <span className="inline-block mt-1.5 text-xs font-semibold text-[#5b6949] bg-[#5b6949]/10 px-2 py-0.5 rounded-full">
                  Save {formatPrice(annualSavings)}
                </span>
              )}
            </div>

            <ul className="space-y-2.5 mb-5 flex-1">
              {[
                { icon: Download, text: "Unlimited CV downloads" },
                { icon: FileText, text: "Unlimited cover letters" },
                { icon: Briefcase, text: "Unlimited job applications" },
                { icon: Check, text: "All platform features" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-[#5b6949]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3 text-[#5b6949]" />
                  </div>
                  <span className="text-sm text-zinc-600">{text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(proPriceId)}
              disabled={loading === proPriceId}
              className={cn(
                "w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200",
                "bg-[#5b6949] text-white",
                "hover:bg-[#4a573a] shadow-md shadow-[#5b6949]/20 hover:shadow-lg hover:shadow-[#5b6949]/25",
                "flex items-center justify-center gap-2",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
            >
              {loading === proPriceId ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="relative rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg transition-all duration-300 flex flex-col p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-zinc-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">Lifetime</h3>
                <p className="text-[11px] text-zinc-400">One-time payment</p>
              </div>
            </div>

            <div className="mb-5 pb-4 border-b border-zinc-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-zinc-900">
                  {formatPrice(geo?.lifetime ?? 149)}
                </span>
                <span className="text-sm font-medium text-zinc-400">
                  one-time
                </span>
              </div>
              <span className="inline-block mt-1.5 text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                Pay once, own forever
              </span>
            </div>

            <ul className="space-y-2.5 mb-5 flex-1">
              {[
                { icon: Check, text: "Everything in Pro, forever" },
                { icon: Bot, text: "Smart Apply (coming soon)" },
                { icon: Sparkles, text: "All future features" },
                { icon: Headphones, text: "Priority support" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3 text-zinc-500" />
                  </div>
                  <span className="text-sm text-zinc-600">{text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(lifetimePriceId)}
              disabled={loading === lifetimePriceId}
              className={cn(
                "w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200",
                "bg-zinc-900 text-white",
                "hover:bg-zinc-800 shadow-md hover:shadow-lg",
                "flex items-center justify-center gap-2",
                "disabled:opacity-70 disabled:cursor-not-allowed"
              )}
            >
              {loading === lifetimePriceId ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Get Lifetime Access
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-5 px-6 pb-6 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure via Stripe</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-200" />
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Cancel anytime</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-200" />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
