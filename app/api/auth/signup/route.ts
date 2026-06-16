import { z } from "zod";
import { fail, ok, parseBody, route } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  full_name: z.string().min(1, "Name is required."),
});

export const POST = route(async (request) => {
  const { email, password, full_name } = await parseBody(request, Body);
  const supabase = await getServerSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });

  if (error) return fail(400, error.message);
  // The handle_new_user trigger creates the profile row automatically.
  return ok({ user: data.user, session: data.session }, 201);
});
