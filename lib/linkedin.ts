/**
 * Shared LinkedIn publishing logic.
 *
 * Both the manual "publish now" route and the scheduled-post cron worker call
 * `publishToLinkedIn` so there is a single, well-tested path to LinkedIn's API.
 * Callers pass a connected account row (from `user_linkedin_accounts`) plus the
 * text to post; the helper performs token validation and the UGC Posts call and
 * returns a structured result instead of throwing, so the cron worker can record
 * per-post failures without aborting the whole batch.
 */

export type LinkedInAccount = {
  linkedin_id: string;
  access_token: string;
  token_expires_at: string;
};

export type PublishResult =
  | { ok: true; linkedinPostId: string }
  | { ok: false; error: string; code: "TOKEN_EXPIRED" | "API_ERROR" | "NETWORK_ERROR" };

/** Returns true if the account's access token is already expired. */
export function isTokenExpired(account: Pick<LinkedInAccount, "token_expires_at">): boolean {
  return new Date(account.token_expires_at).getTime() <= Date.now();
}

/**
 * Publishes `text` to LinkedIn on behalf of `account` using the UGC Posts API.
 * Never throws — failures are returned as `{ ok: false, ... }`.
 */
export async function publishToLinkedIn(
  account: LinkedInAccount,
  text: string,
): Promise<PublishResult> {
  if (isTokenExpired(account)) {
    return {
      ok: false,
      code: "TOKEN_EXPIRED",
      error: "LinkedIn token expired. Please reconnect your LinkedIn account.",
    };
  }

  const authorUrn = `urn:li:person:${account.linkedin_id}`;

  let response: Response;
  let responseText: string;
  try {
    response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });
    responseText = await response.text();
  } catch (err) {
    return {
      ok: false,
      code: "NETWORK_ERROR",
      error: `Could not reach LinkedIn: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }

  if (!response.ok) {
    // A 401 means the token is invalid/revoked even if not past its expiry.
    const code = response.status === 401 ? "TOKEN_EXPIRED" : "API_ERROR";
    return {
      ok: false,
      code,
      error: `LinkedIn API error (${response.status}): ${responseText}`,
    };
  }

  let linkedinPostId = "";
  try {
    linkedinPostId = JSON.parse(responseText).id ?? "";
  } catch {
    // LinkedIn also returns the id in the x-restli-id header on some responses.
    linkedinPostId = response.headers.get("x-restli-id") ?? "";
  }

  return { ok: true, linkedinPostId };
}
