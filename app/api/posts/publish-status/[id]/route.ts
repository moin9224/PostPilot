import { ApiError, ok, requireUser, route } from "@/lib/api";

interface Ctx {
  params: Promise<{ id: string }>;
}

export const GET = route<Ctx>(async (_request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("generated_posts")
    .select("status, linkedin_post_id, published_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) throw new ApiError(404, "Post not found.");

  return ok({
    status: data.status,
    linkedinPostId: data.linkedin_post_id,
    publishedAt: data.published_at,
    error: data.status === "failed" ? "Publishing failed." : null,
  });
});
