import { redirect } from "next/navigation";
import { fail } from "@/lib/api";
import crypto from "crypto";

/**
 * Initiates LinkedIn OAuth flow.
 *
 * Creates a random state token for CSRF protection and redirects user to LinkedIn.
 * After user approves, LinkedIn redirects to /api/auth/linkedin/callback
 */
export const GET = async (request: Request) => {
  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;

    // Get the origin from the request header (works in both local & production)
    const url = new URL(request.url);
    const origin = url.origin;
    const redirectUri = `${origin}/api/auth/linkedin/callback`;

    if (!clientId) {
      return fail(500, "LinkedIn Client ID not configured");
    }

    // Generate random state token for CSRF protection
    const state = crypto.randomBytes(32).toString("hex");

    // Build LinkedIn authorization URL
    const linkedInUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    linkedInUrl.searchParams.append("response_type", "code");
    linkedInUrl.searchParams.append("client_id", clientId);
    linkedInUrl.searchParams.append("redirect_uri", redirectUri);
    linkedInUrl.searchParams.append("state", state);
    // Scopes:
    // - openid, profile, email: Sign In with LinkedIn (OpenID Connect)
    // - w_member_social: Share on LinkedIn (publish posts on user's behalf)
    linkedInUrl.searchParams.append("scope", "openid profile email w_member_social");

    // Redirect to LinkedIn
    redirect(linkedInUrl.toString());
  } catch (err) {
    // Re-throw Next.js redirect errors
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      throw err;
    }
    return fail(500, `Failed to initiate LinkedIn OAuth: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};
