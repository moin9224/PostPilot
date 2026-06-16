import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError } from "./api";
import type { SubscriptionPlan } from "./db-types";

/** Daily AI-generation caps per plan. `null` = unlimited. */
const DAILY_GENERATION_LIMITS: Record<SubscriptionPlan, number | null> = {
  free: 10,
  starter: 100,
  pro: 1000,
  agency: null,
};

export interface UsageInfo {
  plan: SubscriptionPlan;
  used: number;
  limit: number | null;
  remaining: number | null;
}

/** Count AI-generated posts created by the user since midnight UTC today. */
export async function getDailyGenerationUsage(
  supabase: SupabaseClient,
  userId: string,
  plan: SubscriptionPlan,
): Promise<UsageInfo> {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("generated_posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("ai_generated", true)
    .gte("created_at", startOfDay.toISOString());

  if (error) throw new ApiError(500, "Could not check usage limits.");

  const used = count ?? 0;
  const limit = DAILY_GENERATION_LIMITS[plan];
  return {
    plan,
    used,
    limit,
    remaining: limit === null ? null : Math.max(0, limit - used),
  };
}

/** Throw 429 if the user has exhausted today's generation quota. */
export function assertWithinLimit(usage: UsageInfo, requested: number) {
  if (usage.limit === null) return; // unlimited
  if (usage.used + requested > usage.limit) {
    throw new ApiError(
      429,
      `Daily limit reached (${usage.limit} posts/day on the ${usage.plan} plan). Upgrade for more.`,
    );
  }
}
