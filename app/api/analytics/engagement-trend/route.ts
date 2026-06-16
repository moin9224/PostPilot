import { ok, requireUser, route } from "@/lib/api";
import type { GeneratedPostRow } from "@/lib/db-types";

const PERIOD_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

export const GET = route(async (request) => {
  const { user, supabase } = await requireUser();
  const url = new URL(request.url);
  const period = url.searchParams.get("period") ?? "30d";
  const days = PERIOD_DAYS[period] ?? 30;

  const since = new Date(Date.now() - days * 86400000);
  since.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("generated_posts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "published")
    .gte("created_at", since.toISOString());

  if (error) throw new Error(error.message);
  const posts = data as GeneratedPostRow[];

  // Bucket per day: impressions + total engagement.
  const series = Array.from({ length: days }).map((_, i) => {
    const day = new Date(since);
    day.setUTCDate(since.getUTCDate() + i);
    const next = new Date(day);
    next.setUTCDate(day.getUTCDate() + 1);
    const dayPosts = posts.filter((p) => {
      const t = new Date(p.published_at ?? p.created_at);
      return t >= day && t < next;
    });
    return {
      date: day.toISOString().slice(0, 10),
      impressions: dayPosts.reduce((s, p) => s + p.impressions, 0),
      engagement: dayPosts.reduce(
        (s, p) => s + p.reactions + p.comments + p.shares,
        0,
      ),
    };
  });

  return ok({ period, series });
});
