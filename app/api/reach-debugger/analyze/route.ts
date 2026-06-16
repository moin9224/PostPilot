import { ApiError, ok, preflight, requireUser, route } from "@/lib/api";
import { analyzeReach } from "@/lib/reach-analyzer";
import type { GeneratedPostRow, ProfileRow } from "@/lib/db-types";

export const OPTIONS = () => preflight();

export const POST = route(async () => {
  const { user, supabase } = await requireUser();

  const [{ data: profile }, { data: posts }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("generated_posts").select("*").eq("user_id", user.id),
  ]);

  if (!profile) throw new ApiError(404, "Profile not found.");

  const analysis = analyzeReach(
    profile as ProfileRow,
    (posts ?? []) as GeneratedPostRow[],
  );

  // Persist the snapshot so /latest can return it.
  const { error } = await supabase.from("reach_analysis").insert({
    user_id: user.id,
    analysis_data: analysis,
  });
  if (error) console.error("[reach-debugger] save failed:", error.message);

  return ok(analysis);
});
