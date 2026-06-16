import { fail, ok, route } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";

/**
 * Syncs user's LinkedIn posts and analytics.
 *
 * Flow:
 * 1. Get user's LinkedIn account from database
 * 2. Use access token to call LinkedIn API
 * 3. Fetch user's recent posts
 * 4. Fetch analytics for each post
 * 5. Store in our database
 * 6. Return synced data
 */
export const POST = route(async (request) => {
  const supabase = await getServerSupabase();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    return fail(401, "Not authenticated");
  }

  // Get user's LinkedIn account
  const { data: linkedinAccount, error: accountError } = await supabase
    .from("user_linkedin_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!linkedinAccount || accountError) {
    return fail(404, "LinkedIn account not connected");
  }

  // Check if token is expired and refresh if needed
  const tokenExpiresAt = new Date(linkedinAccount.token_expires_at);
  const now = new Date();

  if (tokenExpiresAt < now && linkedinAccount.refresh_token) {
    // Refresh the token
    const refreshResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: linkedinAccount.refresh_token,
        client_id: process.env.LINKEDIN_CLIENT_ID || "",
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
      }),
    });

    if (refreshResponse.ok) {
      const newTokenData = await refreshResponse.json();
      // Update token in database
      await supabase
        .from("user_linkedin_accounts")
        .update({
          access_token: newTokenData.access_token,
          token_expires_at: new Date(
            Date.now() + newTokenData.expires_in * 1000
          ).toISOString(),
        })
        .eq("id", linkedinAccount.id);

      linkedinAccount.access_token = newTokenData.access_token;
    } else {
      return fail(401, "Failed to refresh LinkedIn token. Please reconnect.");
    }
  }

  // Fetch user's posts from LinkedIn
  try {
    const postsResponse = await fetch(
      "https://api.linkedin.com/rest/ugcPosts?q=authors&authors=urn:li:person:" +
        linkedinAccount.linkedin_id,
      {
        headers: {
          Authorization: `Bearer ${linkedinAccount.access_token}`,
          "LinkedIn-Version": "202401",
        },
      }
    );

    if (!postsResponse.ok) {
      return fail(400, "Failed to fetch posts from LinkedIn");
    }

    const postsData = await postsResponse.json();
    const posts = postsData.elements || [];

    // Fetch analytics for each post
    const postsWithMetrics = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const metricsResponse = await fetch(
            `https://api.linkedin.com/rest/posts/${post.id}/postMetrics`,
            {
              headers: {
                Authorization: `Bearer ${linkedinAccount.access_token}`,
                "LinkedIn-Version": "202401",
              },
            }
          );

          if (metricsResponse.ok) {
            const metrics = await metricsResponse.json();
            return {
              ...post,
              metrics: metrics.elements?.[0] || {},
            };
          }
          return post;
        } catch (e) {
          console.error("Failed to fetch metrics for post:", e);
          return post;
        }
      })
    );

    // Store posts in our database
    const postsToStore = postsWithMetrics.map((post: any) => ({
      user_id: user.id,
      linkedin_account_id: linkedinAccount.id,
      linkedin_id: post.id,
      text: post.specificContent?.["com.linkedin.ugc.ShareContent"]?.shareCommentary?.text || "",
      impressions: post.metrics?.impressionCount || 0,
      likes: post.metrics?.likeCount || 0,
      comments: post.metrics?.commentCount || 0,
      shares: post.metrics?.shareCount || 0,
      clicks: post.metrics?.clickCount || 0,
      posted_at: new Date(post.created?.time).toISOString(),
    }));

    if (postsToStore.length > 0) {
      await supabase
        .from("linkedin_posts")
        .upsert(postsToStore, { onConflict: "linkedin_id" });
    }

    return ok({
      message: "LinkedIn data synced successfully",
      postsCount: postsToStore.length,
    });
  } catch (error: any) {
    return fail(500, `Failed to sync LinkedIn data: ${error.message}`);
  }
});
