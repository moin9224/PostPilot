import { fail, ok, route, parseBody } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const Body = z.object({
  postId: z.string().optional(),
  content: z.string().optional(),
  scheduledFor: z.string().optional(),
});

/**
 * Publishes a post to LinkedIn using Share on LinkedIn API.
 *
 * Uses /v2/ugcPosts endpoint with w_member_social scope.
 * If scheduledFor provided, schedules for later.
 * Otherwise publishes immediately.
 */
export const POST = route(async (request) => {
  const { postId, content, scheduledFor } = await parseBody(request, Body);
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
    return fail(404, "LinkedIn account not connected. Please connect your LinkedIn first.");
  }

  // Get the content to publish
  let postContent = content;
  if (postId && !content) {
    const { data: post } = await supabase
      .from("generated_posts")
      .select("content")
      .eq("id", postId)
      .eq("user_id", user.id)
      .single();
    postContent = post?.content;
  }

  if (!postContent) {
    return fail(400, "No content to publish");
  }

  // If scheduled for future, store in DB and return
  if (scheduledFor) {
    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate > new Date()) {
      await supabase
        .from("scheduled_posts_v2")
        .insert({
          user_id: user.id,
          text: postContent,
          scheduled_for: scheduledFor,
          status: "scheduled",
        });

      return ok({ message: "Post scheduled successfully" });
    }
  }

  // Check token expiry
  const tokenExpiry = new Date(linkedinAccount.token_expires_at);
  if (tokenExpiry < new Date()) {
    return fail(401, "LinkedIn token expired. Please reconnect your LinkedIn account.");
  }

  // Publish to LinkedIn using UGC Posts API
  try {
    const authorUrn = `urn:li:person:${linkedinAccount.linkedin_id}`;

    const publishResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${linkedinAccount.access_token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postContent,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    const responseText = await publishResponse.text();

    if (!publishResponse.ok) {
      console.error("LinkedIn publish failed:", responseText);
      return fail(400, `Failed to publish to LinkedIn: ${responseText}`);
    }

    const publishedPost = JSON.parse(responseText);
    const linkedinPostId = publishedPost.id;

    // Update post status in database if postId provided
    if (postId) {
      await supabase
        .from("generated_posts")
        .update({
          status: "published",
          linkedin_post_id: linkedinPostId,
          published_at: new Date().toISOString(),
        })
        .eq("id", postId);
    }

    return ok({
      message: "Post published to LinkedIn successfully",
      linkedinPostId,
    });
  } catch (error: any) {
    console.error("LinkedIn publish error:", error);
    return fail(500, `Failed to publish post: ${error.message}`);
  }
});
