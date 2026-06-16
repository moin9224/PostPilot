import { z } from "zod";
import { ApiError, ok, parseBody, preflight, requireUser, route } from "@/lib/api";

export const OPTIONS = () => preflight();

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) throw new ApiError(404, "Profile not found.");

  // Never leak the LinkedIn access token to the client.
  const { linkedin_access_token, ...safe } = data;
  return ok({ profile: { ...safe, linkedin_connected: !!linkedin_access_token } });
});

const Body = z.object({
  full_name: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  profile_picture_url: z.string().url().optional(),
  linkedin_profile_url: z.string().url().optional(),
});

export const PUT = route(async (request) => {
  const { user, supabase } = await requireUser();
  const body = await parseBody(request, Body);

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, "No fields to update.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  const { linkedin_access_token, ...safe } = data;
  return ok({ profile: { ...safe, linkedin_connected: !!linkedin_access_token } });
});
