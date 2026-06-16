import { ok, preflight, requireUser, route } from "@/lib/api";

export const OPTIONS = () => preflight();

export const POST = route(async () => {
  const { user, supabase } = await requireUser();

  const { error } = await supabase
    .from("profiles")
    .update({ linkedin_access_token: null })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  return ok({ success: true, linkedin_connected: false });
});
