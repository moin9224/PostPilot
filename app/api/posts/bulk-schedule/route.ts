import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route } from "@/lib/api";

const Body = z.object({
  posts: z
    .array(
      z.object({
        content: z.string().min(1),
        scheduledFor: z.string().datetime().optional(),
        postId: z.string().uuid().optional(),
      }),
    )
    .min(1, "Provide at least one post."),
  timezone: z.string().default("UTC"),
  // When individual scheduledFor values are omitted, auto-space starting now.
  spacingHours: z.number().int().min(1).max(168).default(48),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { posts, timezone, spacingHours } = await parseBody(request, Body);

  const now = Date.now();
  const rows = posts.map((p, i) => ({
    user_id: user.id,
    post_id: p.postId ?? null,
    content: p.content,
    scheduled_for:
      p.scheduledFor ??
      new Date(now + (i + 1) * spacingHours * 3600_000).toISOString(),
    timezone,
    status: "scheduled" as const,
  }));

  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert(rows)
    .select("id, scheduled_for");

  if (error) throw new Error(error.message);
  return ok({ scheduled: data, count: data.length }, 201);
});
