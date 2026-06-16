import { ok, route } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";

export const POST = route(async () => {
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
  return ok({ success: true });
});
