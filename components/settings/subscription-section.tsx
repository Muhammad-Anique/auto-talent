"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Zap, ExternalLink, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  getSubscriptionStatus,
  createBillingPortalSession,
} from "@/utils/actions/subscriptions/actions";
import type { PlanType } from "@/lib/stripe";

export function SubscriptionSection() {
  const [plan, setPlan] = useState<PlanType>("free");
  const [status, setStatus] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const sub = await getSubscriptionStatus();
        setPlan(sub.plan);
        setStatus(sub.status);
        setPeriodEnd(sub.currentPeriodEnd);
        setCancelAtPeriodEnd(sub.cancelAtPeriodEnd);
      } catch (error) {
        console.error("Error loading subscription:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      await createBillingPortalSession();
    } catch (error) {
      console.error("Portal error:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-8 justify-center">
        <div className="w-4 h-4 border-2 border-zinc-200 border-t-[#5b6949] rounded-full animate-spin" />
        <span className="text-sm text-zinc-400">Loading subscription...</span>
      </div>
    );
  }

  const planConfig = {
    free: {
      icon: Zap,
      label: "Free Plan",
      color: "text-zinc-500",
      bg: "bg-zinc-100",
    },
    pro: {
      icon: Sparkles,
      label: "Pro Plan",
      color: "text-[#5b6949]",
      bg: "bg-[#5b6949]/10",
    },
    lifetime: {
      icon: Crown,
      label: "Lifetime Plan",
      color: "text-zinc-900",
      bg: "bg-zinc-900/10",
    },
  }[plan];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", planConfig.bg)}>
            <planConfig.icon className={cn("w-5 h-5", planConfig.color)} />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900">{planConfig.label}</h4>
            <p className="text-xs text-zinc-400">
              {plan === "free" && "Limited access"}
              {plan === "pro" && status === "active" && !cancelAtPeriodEnd && "Active subscription"}
              {plan === "pro" && cancelAtPeriodEnd && "Cancels at period end"}
              {plan === "lifetime" && "Lifetime access - never expires"}
            </p>
          </div>
        </div>

        {plan === "pro" && periodEnd && (
          <div className="text-right">
            <p className="text-xs text-zinc-400">
              {cancelAtPeriodEnd ? "Access until" : "Renews"}
            </p>
            <p className="text-sm font-medium text-zinc-700">
              {new Date(periodEnd).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {plan === "free" && (
          <Link href="/dashboard/subscription">
            <Button className="bg-[#5b6949] text-white hover:bg-[#4a573a] rounded-xl font-semibold shadow-sm shadow-[#5b6949]/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}

        {plan === "pro" && (
          <Button
            onClick={handleManageBilling}
            disabled={portalLoading}
            variant="outline"
            className="rounded-xl font-medium"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {portalLoading ? "Opening..." : "Manage Billing"}
          </Button>
        )}

        {plan === "lifetime" && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/5 border border-zinc-200">
            <Crown className="w-4 h-4 text-zinc-700" />
            <span className="text-sm font-medium text-zinc-700">
              You have lifetime access. No billing needed.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
