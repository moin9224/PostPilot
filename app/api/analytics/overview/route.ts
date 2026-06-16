import { ok, requireUser, route } from "@/lib/api";
import type { GeneratedPostRow } from "@/lib/db-types";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("generated_posts")
    .select("*")
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  const posts = (data ?? []) as GeneratedPostRow[];
  const published = posts.filter((p) => p.status === "published");

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const thisMonth = published.filter(
    (p) => new Date(p.published_at ?? p.created_at) >= startOfMonth,
  );

  const reachThisMonth = thisMonth.reduce((s, p) => s + p.impressions, 0);

  const engagementRates = published
    .filter((p) => p.impressions > 0)
    .map(
      (p) => ((p.reactions + p.comments + p.shares) / p.impressions) * 100,
    );
  const avgEngagementRate =
    engagementRates.length > 0
      ? Number(
          (
            engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length
          ).toFixed(1),
        )
      : 0;

  const topPost =
    published
      .slice()
      .sort((a, b) => b.impressions - a.impressions)[0] ?? null;

  // 7-day impressions trend ending today.
  const trend = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setUTCHours(0, 0, 0, 0);
    day.setUTCDate(day.getUTCDate() - (6 - i));
    const next = new Date(day);
    next.setUTCDate(day.getUTCDate() + 1);
    const dayPosts = published.filter((p) => {
      const t = new Date(p.published_at ?? p.created_at);
      return t >= day && t < next;
    });
    return {
      date: day.toISOString().slice(0, 10),
      impressions: dayPosts.reduce((s, p) => s + p.impressions, 0),
    };
  });

  return ok({
    totalPostsPublished: published.length,
    averageEngagementRate: avgEngagementRate,
    reachThisMonth,
    topPost,
    performanceTrend: trend,
  });
});
