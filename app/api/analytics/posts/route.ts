import { ok, requireUser, route } from "@/lib/api";
import type { GeneratedPostRow } from "@/lib/db-types";

const PERIOD_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
const SORTABLE = new Set([
  "impressions",
  "reactions",
  "comments",
  "shares",
  "clicks",
  "created_at",
]);

export const GET = route(async (request) => {
  const { user, supabase } = await requireUser();
  const url = new URL(request.url);

  const period = url.searchParams.get("period") ?? "30d";
  const sortParam = url.searchParams.get("sort") ?? "impressions";
  const days = PERIOD_DAYS[period] ?? 30;
  const sort = SORTABLE.has(sortParam) ? sortParam : "impressions";

  const since = new Date(Date.now() - days * 86400000).toISOString();

  const { data, error } = await supabase
    .from("generated_posts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "published")
    .gte("created_at", since)
    .order(sort, { ascending: false });

  if (error) throw new Error(error.message);

  // Attach a computed engagement rate to each row.
  const posts = (data as GeneratedPostRow[]).map((p) => ({
    ...p,
    engagement_rate:
      p.impressions > 0
        ? Number(
            (
              ((p.reactions + p.comments + p.shares) / p.impressions) * 100
            ).toFixed(1),
          )
        : 0,
  }));

  return ok({ period, sort, posts });
});
