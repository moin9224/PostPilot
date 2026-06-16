import { ok, requireUser, route } from "@/lib/api";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return ok({ user, profile });
});
