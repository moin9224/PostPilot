import { redirect } from "next/navigation";
import { fail, ok, route } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const Query = z.object({
  code: z.string(),
  state: z.string(),
  error: z.string().optional(),
});

/**
 * LinkedIn OAuth callback handler.
 *
 * Flow:
 * 1. User clicks "Sign in with LinkedIn"
 * 2. Gets redirected to LinkedIn authorization page
 * 3. User grants permission
 * 4. LinkedIn redirects here with `code` and `state`
 * 5. We exchange `code` for access token
 * 6. We store token securely in database
 * 7. User is logged in automatically
 */
export const GET = route(async (request) => {
  const url = new URL(request.url);
  const query = Query.parse(Object.fromEntries(url.searchParams));

  // Handle LinkedIn errors
  if (query.error) {
    return fail(400, `LinkedIn error: ${query.error}`);
  }

  const supabase = await getServerSupabase();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (!session || sessionError) {
    return fail(401, "No session found. Please sign up first.");
  }

  // Exchange authorization code for access token
  const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: query.code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/linkedin/callback`,
      client_id: process.env.LINKEDIN_CLIENT_ID || "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
  });

  if (!tokenResponse.ok) {
    return fail(400, "Failed to exchange authorization code for access token");
  }

  const tokenData = await tokenResponse.json();
  const { access_token, expires_in, refresh_token } = tokenData;

  // Get LinkedIn profile info
  const profileResponse = await fetch("https://api.linkedin.com/rest/me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileResponse.ok) {
    return fail(400, "Failed to fetch LinkedIn profile");
  }

  const profile = await profileResponse.json();
  const linkedinId = profile.id;
  const profileName = `${profile.localizedFirstName} ${profile.localizedLastName}`;

  // Store LinkedIn account in database
  const { error: insertError } = await supabase
    .from("user_linkedin_accounts")
    .upsert(
      {
        user_id: session.user.id,
        linkedin_id: linkedinId,
        profile_name: profileName,
        access_token: access_token, // Should be encrypted in production
        refresh_token: refresh_token,
        token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        is_active: true,
      },
      { onConflict: "user_id,linkedin_id" }
    );

  if (insertError) {
    console.error("Failed to store LinkedIn account:", insertError);
    return fail(500, "Failed to store LinkedIn account");
  }

  // Redirect to dashboard
  return redirect("/dashboard");
});
