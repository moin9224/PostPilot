import { ApiError, ok, preflight, requireUser, route } from "@/lib/api";

interface Ctx {
  params: Promise<{ id: string }>;
}

export const OPTIONS = () => preflight();

export const DELETE = route<Ctx>(async (_request, { params }) => {
  const { id } = await params;
  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("competitors")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new ApiError(404, "Competitor not found.");
  return ok({ success: true });
});
