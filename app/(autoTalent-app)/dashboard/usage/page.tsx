import { getSubscriptionStatus } from "@/utils/actions/subscriptions/actions";
import { getAllUsageCounts } from "@/utils/actions/subscriptions/usage";
import { PLANS, type ActionType } from "@/lib/stripe";
import {
  Download,
  FileText,
  Mail,
  MessageSquare,
  Search,
  Bot,
  Crown,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACTION_META: Record<ActionType, { label: string; icon: typeof Download; color: string }> = {
  cv_download: { label: "CV Downloads", icon: Download, color: "from-blue-500 to-blue-600" },
  cover_letter_create: { label: "Cover Letters", icon: FileText, color: "from-emerald-500 to-emerald-600" },
  follow_up_email: { label: "Follow-Up Emails", icon: Mail, color: "from-amber-500 to-amber-600" },
  questionnaire: { label: "Interview Questions", icon: MessageSquare, color: "from-purple-500 to-purple-600" },
  job_search: { label: "Job Searches", icon: Search, color: "from-pink-500 to-pink-600" },
  agent_message: { label: "Agent Messages", icon: Bot, color: "from-cyan-500 to-cyan-600" },
};

export default async function UsagePage() {
  const [subscription, counts] = await Promise.all([
    getSubscriptionStatus(),
    getAllUsageCounts(),
  ]);

  const plan = (subscription.plan || "free") as keyof typeof PLANS;
  const planConfig = PLANS[plan] || PLANS.free;
  const isPaid = plan === "pro" || plan === "lifetime" || plan === "starter";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60">
              <BarChart3 className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-zinc-900">Usage</h1>
              <p className="text-zinc-600 text-sm mt-1">
                Track your credits and plan usage
              </p>
            </div>
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#5b6949] to-[#3d4a30] px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5" />
                <div>
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wider">
                    Current Plan
                  </p>
                  <h2 className="text-xl font-bold">
                    {planConfig.name}
                  </h2>
                </div>
              </div>
              {plan === "free" && (
                <Link
                  href="/dashboard/billing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#5b6949] rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Upgrade
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {subscription.status && plan !== "free" && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  {subscription.cancelAtPeriodEnd ? "Cancels at period end" : "Active"}
                </span>
              )}
            </div>
          </div>

          {/* Usage Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {(Object.keys(ACTION_META) as ActionType[]).map((action) => {
              const meta = ACTION_META[action];
              const Icon = meta.icon;
              const used = counts[action] ?? 0;
              const limit = planConfig.limits[action];
              const isUnlimited = limit === Infinity;
              const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
              const isExhausted = !isUnlimited && used >= limit;

              return (
                <div
                  key={action}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    isExhausted
                      ? "border-red-200 bg-red-50/50"
                      : "border-zinc-200 bg-white hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                        meta.color
                      )}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-zinc-700">
                      {meta.label}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-2xl font-bold text-zinc-900">
                      {used}
                    </span>
                    <span className="text-sm text-zinc-400">
                      / {isUnlimited ? "\u221E" : limit}
                    </span>
                  </div>

                  {!isUnlimited && (
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                          isExhausted ? "from-red-400 to-red-500" : meta.color
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}

                  {isUnlimited && (
                    <p className="text-xs text-[#5b6949] font-medium">
                      Unlimited
                    </p>
                  )}

                  {isExhausted && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      Limit reached
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upgrade prompt for free users */}
        {plan === "free" && (
          <div className="rounded-2xl bg-gradient-to-br from-[#5b6949]/5 to-[#5b6949]/10 border border-[#5b6949]/20 p-6 text-center space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900">
              Need more credits?
            </h3>
            <p className="text-sm text-zinc-600 max-w-md mx-auto">
              Upgrade to Starter for more monthly credits, or go Pro for unlimited access to everything.
            </p>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5b6949] text-white rounded-xl text-sm font-semibold hover:bg-[#4a573a] transition-colors shadow-lg"
            >
              View Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
