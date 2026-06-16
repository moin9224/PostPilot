import { redirect } from "next/navigation";
import { route, fail } from "@/lib/api";
import crypto from "crypto";

/**
 * Initiates LinkedIn OAuth flow.
 *
 * Creates a random state token for CSRF protection and redirects user to LinkedIn.
 * After user approves, LinkedIn redirects to /api/auth/linkedin/callback
 */
export const GET = route(async (request) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/linkedin/callback`;

  if (!clientId) {
    return fail(500, "LinkedIn Client ID not configured");
  }

  // Generate random state token for CSRF protection
  const state = crypto.randomBytes(32).toString("hex");

  // Store state in a cookie (for verification in callback)
  const linkedInUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
  linkedInUrl.searchParams.append("response_type", "code");
  linkedInUrl.searchParams.append("client_id", clientId);
  linkedInUrl.searchParams.append("redirect_uri", redirectUri);
  linkedInUrl.searchParams.append("state", state);
  linkedInUrl.searchParams.append("scope", "openid profile email");

  // Redirect to LinkedIn
  return redirect(linkedInUrl.toString());
});
