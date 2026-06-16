import { ok, requireUser, route } from "@/lib/api";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("competitors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ok({ competitors: data });
});
