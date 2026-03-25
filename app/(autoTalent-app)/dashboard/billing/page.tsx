"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Crown,
  Zap,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Receipt,
  CreditCard,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RotateCcw,
  FileText,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSubscriptionStatus,
  createBillingPortalSession,
  cancelSubscription,
  reactivateSubscription,
  getInvoices,
  type InvoiceItem,
} from "@/utils/actions/subscriptions/actions";
import Link from "next/link";
import type { PlanType } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export default function BillingPage() {
  const t = useTranslations("dashboard.billingPage");
  const [plan, setPlan] = useState<PlanType>("free");
  const [status, setStatus] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadData() {
    try {
      const sub = await getSubscriptionStatus();
      setPlan(sub.plan);
      setStatus(sub.status);
      setPeriodEnd(sub.currentPeriodEnd);
      setCancelAtPeriodEnd(sub.cancelAtPeriodEnd);

      try {
        const inv = await getInvoices();
        setInvoices(inv);
      } catch {
        console.error("Failed to load invoices");
      }
    } catch (e) {
      console.error("Failed to load subscription:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handlePortal = async () => {
    setActionLoading("portal");
    try {
      await createBillingPortalSession();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    setActionLoading("cancel");
    try {
      const result = await cancelSubscription();
      if (result.success) {
        setCancelAtPeriodEnd(true);
        toast({
          title: "Subscription canceled",
          description: "Your subscription will remain active until the end of the billing period.",
        });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async () => {
    setActionLoading("reactivate");
    try {
      const result = await reactivateSubscription();
      if (result.success) {
        setCancelAtPeriodEnd(false);
        toast({
          title: "Subscription reactivated",
          description: "Your subscription will continue as normal.",
        });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const isPaid = plan === "pro" || plan === "lifetime" || plan === "starter";

  const planConfig = {
    free: { icon: Zap, label: "Free Plan", color: "text-zinc-500", bg: "bg-zinc-100", border: "border-zinc-200" },
    starter: { icon: Zap, label: "Starter Plan", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    pro: { icon: Sparkles, label: "Pro Plan", color: "text-[#5b6949]", bg: "bg-[#5b6949]/10", border: "border-[#5b6949]/20" },
    lifetime: { icon: Crown, label: "Lifetime Plan", color: "text-zinc-900", bg: "bg-zinc-900/10", border: "border-zinc-300" },
  }[plan];

  function formatDate(ts: number | string) {
    return new Date(typeof ts === "number" ? ts * 1000 : ts).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  }

  function invoiceStatusBadge(status: string | null) {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case "open":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Open
          </span>
        );
      case "uncollectible":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            Unpaid
          </span>
        );
      case "void":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            Void
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
            {status || "Draft"}
          </span>
        );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-200 border-t-[#5b6949] rounded-full animate-spin" />
          <span className="text-sm text-zinc-500">{t("loadingBilling")}</span>
        </div>
      </div>
    );
  }

  const unpaidInvoices = invoices.filter((inv) => inv.status === "open");

  return (
    <div className="min-h-screen bg-[#fafaf9] relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7db_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {t("backToDashboard")}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Unpaid invoices alert */}
        {unpaidInvoices.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {t("unpaidInvoicesTitle", { count: unpaidInvoices.length })}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {t("unpaidInvoicesMessage")}
              </p>
            </div>
            {unpaidInvoices[0]?.hosted_invoice_url && (
              <a href={unpaidInvoices[0].hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg">
                  {t("payNow")}
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Current Plan Card */}
        <div className={cn(
          "rounded-2xl border bg-white shadow-sm overflow-hidden mb-6",
          planConfig.border
        )}>
          {/* Plan header strip */}
          <div className={cn(
            "h-1.5",
            plan === "pro" ? "bg-[#5b6949]" : plan === "lifetime" ? "bg-zinc-900" : "bg-zinc-200"
          )} />

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", planConfig.bg)}>
                  <planConfig.icon className={cn("w-6 h-6", planConfig.color)} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">{planConfig.label}</h2>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {plan === "free" && "Limited downloads and applications"}
                    {plan === "pro" && !cancelAtPeriodEnd && "Unlimited access to all features"}
                    {plan === "pro" && cancelAtPeriodEnd && "Cancels at end of billing period"}
                    {plan === "lifetime" && "Permanent unlimited access"}
                  </p>
                </div>
              </div>

              {plan === "pro" && periodEnd && (
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {cancelAtPeriodEnd ? "Access until" : "Renews on"}
                  </div>
                  <p className="text-sm font-semibold text-zinc-700 mt-0.5">
                    {formatDate(periodEnd)}
                  </p>
                </div>
              )}
            </div>

            {/* Cancellation warning */}
            {cancelAtPeriodEnd && periodEnd && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800 flex-1">
                  Your subscription is set to cancel on <strong>{formatDate(periodEnd)}</strong>. You&apos;ll lose access to Pro features after this date.
                </p>
                <Button
                  size="sm"
                  onClick={handleReactivate}
                  disabled={actionLoading === "reactivate"}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg shrink-0"
                >
                  {actionLoading === "reactivate" ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reactivate
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {plan === "free" && (
                <Link href="/dashboard/subscription">
                  <Button className="bg-[#5b6949] text-white hover:bg-[#4a573a] rounded-xl font-semibold shadow-sm shadow-[#5b6949]/20 h-10">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}

              {plan === "pro" && (
                <>
                  <Button
                    onClick={handlePortal}
                    disabled={actionLoading === "portal"}
                    variant="outline"
                    className="rounded-xl font-medium h-10 border-zinc-200"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {actionLoading === "portal" ? "Opening..." : "Update Payment Method"}
                  </Button>

                  <Link href="/dashboard/subscription">
                    <Button variant="outline" className="rounded-xl font-medium h-10 border-zinc-200">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Change Plan
                    </Button>
                  </Link>

                  {!cancelAtPeriodEnd && (
                    <Button
                      onClick={handleCancel}
                      disabled={actionLoading === "cancel"}
                      variant="ghost"
                      className="rounded-xl font-medium h-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      {actionLoading === "cancel" ? "Canceling..." : "Cancel Subscription"}
                    </Button>
                  )}
                </>
              )}

              {plan === "lifetime" && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <Shield className="w-4 h-4 text-zinc-600" />
                  <span className="text-sm font-medium text-zinc-600">
                    Lifetime access. No billing required.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usage Summary (free plan) */}
        {plan === "free" && (
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 mb-6">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-zinc-400" />
              Free Plan Limits
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "CV Downloads", limit: "1", icon: Download },
                { label: "Cover Letters", limit: "1", icon: FileText },
                { label: "Job Applications", limit: "10", icon: Receipt },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <item.icon className="w-4 h-4 text-zinc-400 mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-zinc-900">{item.limit}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 text-center">
              <Link href="/dashboard/subscription">
                <Button
                  variant="ghost"
                  className="text-[#5b6949] hover:bg-[#5b6949]/5 font-semibold text-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Upgrade for unlimited access
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Invoices */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-zinc-400" />
                {t("invoiceHistory")}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t("viewAndDownload")}
              </p>
            </div>
            {isPaid && (
              <Button
                onClick={handlePortal}
                disabled={actionLoading === "portal"}
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-zinc-700"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Stripe Portal
              </Button>
            )}
          </div>

          {invoices.length === 0 ? (
            <div className="py-12 text-center">
              <Receipt className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">{t("noInvoices")}</p>
              <p className="text-xs text-zinc-300 mt-1">
                {t("invoicesWillAppear")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-zinc-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {inv.number || "Draft Invoice"}
                      </p>
                      {invoiceStatusBadge(inv.status)}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {formatDate(inv.created)}
                      {inv.period_start && inv.period_end && (
                        <span className="ml-2 text-zinc-300">
                          {formatDate(inv.period_start)} — {formatDate(inv.period_end)}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-sm font-semibold",
                      inv.status === "paid" ? "text-zinc-700" : "text-amber-700"
                    )}>
                      {formatCurrency(inv.amount_due, inv.currency)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {inv.status === "open" && inv.hosted_invoice_url && (
                      <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="h-8 px-3 text-xs bg-[#5b6949] hover:bg-[#4a573a] text-white rounded-lg">
                          Pay
                        </Button>
                      </a>
                    )}
                    {inv.hosted_invoice_url && (
                      <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-600">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    )}
                    {inv.invoice_pdf && (
                      <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-600">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer help text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-400">
            {t("needHelp")}{" "}
            <a href="mailto:support@autotalent.app" className="text-[#5b6949] hover:underline font-medium">
              {t("contactSupport")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
