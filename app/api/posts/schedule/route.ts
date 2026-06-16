import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route } from "@/lib/api";

const Body = z.object({
  content: z.string().min(1, "Content is required."),
  scheduledFor: z.string().datetime({ message: "scheduledFor must be ISO 8601." }),
  timezone: z.string().default("UTC"),
  postId: z.string().uuid().optional(),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { content, scheduledFor, timezone, postId } = await parseBody(
    request,
    Body,
  );

  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert({
      user_id: user.id,
      post_id: postId ?? null,
      content,
      scheduled_for: scheduledFor,
      timezone,
      status: "scheduled",
    })
    .select("id, scheduled_for")
    .single();

  if (error) throw new Error(error.message);

  // Keep the source post's status in sync if one was provided.
  if (postId) {
    await supabase
      .from("generated_posts")
      .update({ status: "scheduled", scheduled_for: scheduledFor })
      .eq("id", postId)
      .eq("user_id", user.id);
  }

  return ok({ postId: data.id, scheduledFor: data.scheduled_for }, 201);
});
