import { z } from "zod";
import { ApiError, ok, parseBody, preflight, requireUser, route } from "@/lib/api";
import { sendTeamInvite } from "@/lib/email";

const Body = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { email, role } = await parseBody(request, Body);

  const { data, error } = await supabase
    .from("team_members")
    .insert({
      user_id: user.id,
      email,
      role,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    // Unique violation → already invited.
    if (error.code === "23505") {
      throw new ApiError(409, "That email has already been invited.");
    }
    throw new Error(error.message);
  }

  const inviterName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "A teammate";
  await sendTeamInvite(email, inviterName, role);

  return ok({ invitationId: data.id, member: data }, 201);
});
