import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "./api";
import type { SubscriptionPlan } from "./db-types";

/** Generation limits per plan. `null` = unlimited. */
const GENERATION_LIMITS: Record<SubscriptionPlan, { limit: number | null; period: "week" | "day" }> = {
  free: { limit: 1, period: "week" },    // 1 post per week
  starter: { limit: 50, period: "day" }, // 50 posts per day
  pro: { limit: 500, period: "day" },    // 500 posts per day
  agency: { limit: null, period: "day" }, // unlimited
};

export interface UsageInfo {
  plan: SubscriptionPlan;
  used: number;
  limit: number | null;
  remaining: number | null;
  period: "week" | "day";
  nextResetAt: string; // ISO timestamp
}

/** Get the start of the period (week for free, day for others). */
function getPeriodStart(plan: SubscriptionPlan): Date {
  const now = new Date();
  const config = GENERATION_LIMITS[plan];

  if (config.period === "week") {
    // Start of current week (Monday UTC)
    const date = new Date(now);
    const day = date.getUTCDay();
    const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
    date.setUTCDate(diff);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  } else {
    // Start of current day (midnight UTC)
    const date = new Date(now);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }
}

/** Get the end of the period. */
function getPeriodEnd(plan: SubscriptionPlan): Date {
  const start = getPeriodStart(plan);
  const config = GENERATION_LIMITS[plan];

  if (config.period === "week") {
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return end;
  } else {
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return end;
  }
}

/** Count AI-generated posts created by the user within their current period. */
export async function getGenerationUsage(
  supabase: SupabaseClient,
  userId: string,
  plan: SubscriptionPlan,
): Promise<UsageInfo> {
  const periodStart = getPeriodStart(plan);
  const periodEnd = getPeriodEnd(plan);
  const config = GENERATION_LIMITS[plan];

  const { count, error } = await supabase
    .from("generated_posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("ai_generated", true)
    .gte("created_at", periodStart.toISOString())
    .lt("created_at", periodEnd.toISOString());

  if (error) throw new ApiError(500, "Could not check usage limits.");

  const used = count ?? 0;
  const limit = config.limit;
  return {
    plan,
    used,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - used),
    period: config.period,
    nextResetAt: periodEnd.toISOString(),
  };
}

/** Legacy function name for backwards compatibility. */
export async function getDailyGenerationUsage(
  supabase: SupabaseClient,
  userId: string,
  plan: SubscriptionPlan,
): Promise<UsageInfo> {
  return getGenerationUsage(supabase, userId, plan);
}

/** Throw error if the user has exhausted their generation quota. */
export function assertWithinLimit(usage: UsageInfo, requested: number) {
  if (usage.limit === null) return; // unlimited
  if (usage.used + requested > usage.limit) {
    const periodText = usage.period === "week" ? "week" : "day";
    throw new ApiError(
      429,
      `Limit reached: ${usage.limit} post${usage.limit === 1 ? "" : "s"} per ${periodText} on the ${usage.plan} plan. Upgrade to generate more.`,
    );
  }
}
