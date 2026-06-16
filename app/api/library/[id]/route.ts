import { z } from "zod";
import { ApiError, ok, parseBody, preflight, requireUser, route } from "@/lib/api";

interface Ctx {
  params: Promise<{ id: string }>;
}

export const OPTIONS = () => preflight();

const Body = z.object({
  title: z.string().optional(),
  content: z.string().min(1).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const PUT = route<Ctx>(async (request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();
  const body = await parseBody(request, Body);

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, "No fields to update.");
  }

  const { data, error } = await supabase
    .from("content_library")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) throw new ApiError(404, "Item not found.");
  return ok({ item: data });
});

export const DELETE = route<Ctx>(async (_request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("content_library")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new ApiError(404, "Item not found.");
  return ok({ success: true });
});
