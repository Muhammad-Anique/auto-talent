'use server';

import { createClient } from "@/utils/supabase/server";
import { getSubscriptionStatus } from "./actions";

export type ActionType = 'cv_download' | 'cover_letter_download' | 'job_application';

const FREE_LIMITS: Record<ActionType, number> = {
  cv_download: 1,
  cover_letter_download: 1,
  job_application: 10,
};

export async function getUsageCount(actionType: ActionType): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("usage_tracking")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("action_type", actionType);

  return count ?? 0;
}

export async function checkCanPerformAction(actionType: ActionType): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  plan: string;
}> {
  const subscription = await getSubscriptionStatus();
  const isPaid = subscription.plan === "pro" || subscription.plan === "lifetime";

  if (isPaid) {
    return { allowed: true, used: 0, limit: Infinity, plan: subscription.plan };
  }

  const used = await getUsageCount(actionType);
  const limit = FREE_LIMITS[actionType];

  return {
    allowed: used < limit,
    used,
    limit,
    plan: "free",
  };
}

export async function recordUsage(actionType: ActionType): Promise<{ success: boolean; error?: string }> {
  const check = await checkCanPerformAction(actionType);
  if (!check.allowed) {
    return { success: false, error: `You've reached your free plan limit for this action. Upgrade to continue.` };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("usage_tracking")
    .insert({ user_id: user.id, action_type: actionType });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
