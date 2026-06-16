import { z } from "zod";
import { fail, ok, parseBody, route } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

export const POST = route(async (request) => {
  const { email, password } = await parseBody(request, Body);
  const supabase = await getServerSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return fail(401, error.message);
  return ok({ user: data.user, session: data.session });
});
