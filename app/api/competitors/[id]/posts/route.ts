import { ApiError, ok, requireUser, route } from "@/lib/api";

interface Ctx {
  params: Promise<{ id: string }>;
}

export const GET = route<Ctx>(async (_request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();

  // Confirm ownership of the competitor first (RLS also enforces this).
  const { data: competitor } = await supabase
    .from("competitors")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!competitor) throw new ApiError(404, "Competitor not found.");

  const { data, error } = await supabase
    .from("competitor_posts")
    .select("*")
    .eq("competitor_id", id)
    .order("posted_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ok({ posts: data });
});
