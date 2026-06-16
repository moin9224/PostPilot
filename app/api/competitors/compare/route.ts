import { ok, requireUser, route } from "@/lib/api";
import type { CompetitorRow, GeneratedPostRow } from "@/lib/db-types";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const [{ data: competitors }, { data: posts }] = await Promise.all([
    supabase.from("competitors").select("*").eq("user_id", user.id),
    supabase
      .from("generated_posts")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "published"),
  ]);

  const myPosts = (posts ?? []) as GeneratedPostRow[];
  const withImpr = myPosts.filter((p) => p.impressions > 0);

  const myAvgEngagement =
    withImpr.length > 0
      ? Number(
          (
            withImpr.reduce(
              (s, p) =>
                s + ((p.reactions + p.comments + p.shares) / p.impressions) * 100,
              0,
            ) / withImpr.length
          ).toFixed(1),
        )
      : 0;

  // Approximate your posts/week over the last 4 weeks.
  const cutoff = Date.now() - 28 * 86400000;
  const myFrequency = Number(
    (
      myPosts.filter((p) => new Date(p.created_at).getTime() >= cutoff).length /
      4
    ).toFixed(1),
  );

  const you = { postFrequency: myFrequency, avgEngagement: myAvgEngagement };

  const comparison = (competitors as CompetitorRow[] | null ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    industry: c.industry,
    postFrequency: c.post_frequency,
    avgEngagement: c.avg_engagement,
    frequencyGap:
      c.post_frequency != null
        ? Number((c.post_frequency - myFrequency).toFixed(1))
        : null,
    engagementGap:
      c.avg_engagement != null
        ? Number((c.avg_engagement - myAvgEngagement).toFixed(1))
        : null,
  }));

  return ok({ you, competitors: comparison });
});
