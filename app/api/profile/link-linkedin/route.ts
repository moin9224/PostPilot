import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route } from "@/lib/api";

const Body = z.object({
  linkedinAccessToken: z.string().min(1, "Access token is required."),
  linkedinProfileUrl: z.string().url().optional(),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { linkedinAccessToken, linkedinProfileUrl } = await parseBody(
    request,
    Body,
  );

  const update: Record<string, unknown> = {
    linkedin_access_token: linkedinAccessToken,
  };
  if (linkedinProfileUrl) update.linkedin_profile_url = linkedinProfileUrl;

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  return ok({ success: true, linkedin_connected: true });
});
