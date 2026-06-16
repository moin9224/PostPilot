import { ApiError, ok, preflight, requireUser, route } from "@/lib/api";

interface Ctx {
  params: Promise<{ memberId: string }>;
}

export const OPTIONS = () => preflight();

export const DELETE = route<Ctx>(async (_request, { params }) => {
  const { memberId } = await params;
  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId)
    .eq("user_id", user.id);

  if (error) throw new ApiError(404, "Team member not found.");
  return ok({ success: true });
});
