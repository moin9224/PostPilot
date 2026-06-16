import { ok, requireUser, route } from "@/lib/api";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("reach_analysis")
    .select("*")
    .eq("user_id", user.id)
    .order("analyzed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return ok({ analysis: data?.analysis_data ?? null, analyzedAt: data?.analyzed_at ?? null });
});
