import { z } from "zod";
import { ApiError, ok, parseBody, preflight, requireUser, route } from "@/lib/api";

interface Ctx {
  params: Promise<{ id: string }>;
}

export const OPTIONS = () => preflight();

export const GET = route<Ctx>(async (_request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("generated_posts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) throw new ApiError(404, "Post not found.");
  return ok({ post: data });
});

const PatchBody = z.object({
  content: z.string().min(1).optional(),
  status: z.enum(["draft", "scheduled", "published", "failed"]).optional(),
  hashtags: z.array(z.string()).optional(),
  tone: z.string().optional(),
  industry: z.string().optional(),
  audience: z.string().optional(),
});

export const PUT = route<Ctx>(async (request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();
  const body = await parseBody(request, PatchBody);

  const update: Record<string, unknown> = { ...body };
  if (body.content !== undefined) update.character_count = body.content.length;
  if (Object.keys(update).length === 0) {
    throw new ApiError(400, "No fields to update.");
  }

  const { data, error } = await supabase
    .from("generated_posts")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) throw new ApiError(404, "Post not found.");
  return ok({ post: data });
});

export const DELETE = route<Ctx>(async (_request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("generated_posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new ApiError(404, "Post not found.");
  return ok({ success: true });
});
