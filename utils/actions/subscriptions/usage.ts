'use server';

import { createClient } from "@/utils/supabase/server";
import { getSubscriptionStatus } from "./actions";
import { PLANS, type ActionType, type PlanType } from "@/lib/stripe";

export type { ActionType };

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

export async function getAllUsageCounts(): Promise<Record<ActionType, number>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const defaults: Record<ActionType, number> = {
    cv_download: 0,
    cover_letter_create: 0,
    follow_up_email: 0,
    questionnaire: 0,
    job_search: 0,
    agent_message: 0,
  };

  if (!user) return defaults;

  const { data } = await supabase
    .from("usage_tracking")
    .select("action_type")
    .eq("user_id", user.id);

  if (!data) return defaults;

  for (const row of data) {
    const at = row.action_type as ActionType;
    if (at in defaults) {
      defaults[at]++;
    }
  }

  return defaults;
}

export async function checkCanPerformAction(actionType: ActionType): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  plan: string;
}> {
  const subscription = await getSubscriptionStatus();
  const plan = subscription.plan as PlanType;
  const planConfig = PLANS[plan] || PLANS.free;
  const limit = planConfig.limits[actionType] ?? 0;

  if (limit === Infinity) {
    return { allowed: true, used: 0, limit: Infinity, plan };
  }

  const used = await getUsageCount(actionType);

  return {
    allowed: used < limit,
    used,
    limit,
    plan,
  };
}

export async function checkAllCreditsExhausted(): Promise<boolean> {
  const subscription = await getSubscriptionStatus();
  const plan = subscription.plan as PlanType;
  const planConfig = PLANS[plan] || PLANS.free;

  // Paid plans never run out
  if (plan === "pro" || plan === "lifetime" || plan === "starter") {
    return false;
  }

  const counts = await getAllUsageCounts();

  // Check if ALL free credits are exhausted
  for (const [action, limit] of Object.entries(planConfig.limits)) {
    if (limit === Infinity) return false;
    const used = counts[action as ActionType] ?? 0;
    if (used < limit) return false; // Still has credits for this action
  }

  return true; // All credits exhausted
}

export async function recordUsage(actionType: ActionType): Promise<{ success: boolean; error?: string }> {
  const check = await checkCanPerformAction(actionType);
  if (!check.allowed) {
    return { success: false, error: `You've reached your plan limit for this action. Upgrade to continue.` };
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
