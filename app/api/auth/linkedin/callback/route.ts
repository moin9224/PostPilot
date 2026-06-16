import { NextResponse } from "next/server";
import { fail } from "@/lib/api";
import { getServerSupabase, getAdminSupabase } from "@/lib/supabase-server";

/**
 * LinkedIn OAuth callback handler.
 *
 * Uses OpenID Connect (openid profile email + w_member_social scopes)
 * Flow:
 * 1. User approves on LinkedIn
 * 2. LinkedIn redirects here with `code`
 * 3. Exchange `code` for access_token
 * 4. Fetch profile from /v2/userinfo (OpenID Connect endpoint)
 * 5. Store token + profile using admin client (bypasses RLS safely on server)
 * 6. Redirect to dashboard
 */
export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const errorParam = url.searchParams.get("error");
    const errorDesc = url.searchParams.get("error_description");

    if (errorParam) {
      return NextResponse.redirect(
        new URL(`/dashboard?linkedin_error=${encodeURIComponent(errorDesc || errorParam)}`, url.origin)
      );
    }

    if (!code) {
      return fail(400, "No authorization code received from LinkedIn");
    }

    // Must be signed in to Supabase first
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/login?error=Please+sign+in+before+connecting+LinkedIn", url.origin)
      );
    }

    const redirectUri = `${url.origin}/api/auth/linkedin/callback`;
    const clientId = process.env.LINKEDIN_CLIENT_ID || "";
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || "";

    if (!clientId || !clientSecret) {
      return fail(500, "LinkedIn credentials not configured");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      console.error("LinkedIn token exchange failed:", tokenText);
      return fail(400, `Failed to exchange authorization code: ${tokenText}`);
    }

    const tokenData = JSON.parse(tokenText);
    const { access_token, expires_in, refresh_token, id_token } = tokenData;

    if (!access_token) {
      return fail(400, "No access token returned from LinkedIn");
    }

    // Fetch user profile using OpenID Connect userinfo endpoint
    const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!profileResponse.ok) {
      const errText = await profileResponse.text();
      console.error("LinkedIn profile fetch failed:", errText);
      return fail(400, `Failed to fetch LinkedIn profile: ${errText}`);
    }

    const profile = await profileResponse.json();
    const linkedinId = profile.sub;
    const profileName =
      profile.name || `${profile.given_name || ""} ${profile.family_name || ""}`.trim();
    const profileEmail = profile.email;
    const profilePicture = profile.picture;

    // Use admin client to bypass RLS for this server-trusted insert
    const admin = getAdminSupabase();

    const { error: insertError } = await admin
      .from("user_linkedin_accounts")
      .upsert(
        {
          user_id: user.id,
          linkedin_id: linkedinId,
          profile_name: profileName,
          profile_email: profileEmail,
          profile_photo_url: profilePicture,
          access_token,
          refresh_token: refresh_token || null,
          id_token: id_token || null,
          token_expires_at: new Date(
            Date.now() + (expires_in || 5184000) * 1000
          ).toISOString(),
          connected_at: new Date().toISOString(),
          is_active: true,
        },
        { onConflict: "user_id,linkedin_id" }
      );

    if (insertError) {
      console.error("Failed to store LinkedIn account:", insertError);
      return NextResponse.redirect(
        new URL(`/dashboard?linkedin_error=${encodeURIComponent(insertError.message)}`, url.origin)
      );
    }

    return NextResponse.redirect(new URL("/dashboard?linkedin=connected", url.origin));
  } catch (err) {
    console.error("LinkedIn callback error:", err);
    return fail(500, `LinkedIn OAuth failed: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
};
