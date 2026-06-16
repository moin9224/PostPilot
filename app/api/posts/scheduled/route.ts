import { ok, requireUser, route } from "@/lib/api";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "scheduled")
    .order("scheduled_for", { ascending: true });

  if (error) throw new Error(error.message);
  return ok({ posts: data });
});
