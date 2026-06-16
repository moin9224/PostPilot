import { ApiError, ok, requireUser, route } from "@/lib/api";
import { getDailyGenerationUsage } from "@/lib/rate-limit";
import type { SubscriptionPlan } from "@/lib/db-types";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  if (!profile) throw new ApiError(404, "Profile not found.");
  const plan = profile.subscription_plan as SubscriptionPlan;

  const generation = await getDailyGenerationUsage(supabase, user.id, plan);

  // Count this month's published posts and scheduled queue depth.
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [{ count: publishedThisMonth }, { count: scheduledQueue }] =
    await Promise.all([
      supabase
        .from("generated_posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "published")
        .gte("published_at", startOfMonth.toISOString()),
      supabase
        .from("scheduled_posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "scheduled"),
    ]);

  return ok({
    plan,
    generation,
    publishedThisMonth: publishedThisMonth ?? 0,
    scheduledQueue: scheduledQueue ?? 0,
  });
});
