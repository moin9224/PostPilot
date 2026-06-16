import { z } from "zod";
import { ApiError, ok, parseBody, preflight, requireUser, route } from "@/lib/api";

interface Ctx {
  params: Promise<{ id: string }>;
}

const Body = z.object({
  content: z.string().min(1).optional(),
  scheduledFor: z.string().datetime().optional(),
  timezone: z.string().optional(),
});

export const OPTIONS = () => preflight();

export const PUT = route<Ctx>(async (request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();
  const body = await parseBody(request, Body);

  const update: Record<string, unknown> = {};
  if (body.content !== undefined) update.content = body.content;
  if (body.scheduledFor !== undefined) update.scheduled_for = body.scheduledFor;
  if (body.timezone !== undefined) update.timezone = body.timezone;
  if (Object.keys(update).length === 0) {
    throw new ApiError(400, "No fields to update.");
  }

  const { data, error } = await supabase
    .from("scheduled_posts")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) throw new ApiError(404, "Scheduled post not found.");
  return ok({ post: data });
});

export const DELETE = route<Ctx>(async (_request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("scheduled_posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new ApiError(404, "Scheduled post not found.");
  return ok({ success: true });
});
