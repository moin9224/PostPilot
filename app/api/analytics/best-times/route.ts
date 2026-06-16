import { ok, requireUser, route } from "@/lib/api";
import type { GeneratedPostRow } from "@/lib/db-types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("generated_posts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "published");

  if (error) throw new Error(error.message);
  const posts = data as GeneratedPostRow[];

  // Average engagement rate by day of week.
  const buckets = DAYS.map(() => ({ totalRate: 0, n: 0 }));
  for (const p of posts) {
    if (p.impressions <= 0) continue;
    const dow = new Date(p.published_at ?? p.created_at).getUTCDay();
    const rate = ((p.reactions + p.comments + p.shares) / p.impressions) * 100;
    buckets[dow].totalRate += rate;
    buckets[dow].n += 1;
  }

  const byDay = DAYS.map((label, i) => ({
    day: label,
    engagement:
      buckets[i].n > 0
        ? Number((buckets[i].totalRate / buckets[i].n).toFixed(1))
        : 0,
  }));

  const best = byDay.reduce((a, b) => (b.engagement > a.engagement ? b : a));

  return ok({ byDay, bestDay: best.day });
});
