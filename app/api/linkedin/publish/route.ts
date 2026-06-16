import { fail, ok, route, parseBody } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const Body = z.object({
  postId: z.string(),
  scheduledFor: z.string().optional(),
});

/**
 * Publishes a post to LinkedIn.
 *
 * If scheduledFor is provided, schedules for that time.
 * Otherwise publishes immediately.
 *
 * Flow:
 * 1. Get post from database
 * 2. Get user's LinkedIn account
 * 3. Call LinkedIn API to publish
 * 4. Update post status to "published"
 * 5. Store LinkedIn post ID
 */
export const POST = route(async (request) => {
  const { postId, scheduledFor } = await parseBody(request, Body);
  const supabase = await getServerSupabase();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user || userError) {
    return fail(401, "Not authenticated");
  }

  // If scheduled for future, just update status and return
  if (scheduledFor) {
    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate > new Date()) {
      // Schedule for later
      await supabase
        .from("scheduled_posts_v2")
        .insert({
          user_id: user.id,
          text: "", // Would come from generated_posts table
          scheduled_for: scheduledFor,
          status: "scheduled",
        });

      return ok({ message: "Post scheduled successfully" });
    }
  }

  // Publish immediately
  const { data: linkedinAccount, error: accountError } = await supabase
    .from("user_linkedin_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!linkedinAccount || accountError) {
    return fail(404, "LinkedIn account not connected");
  }

  // Get the post to publish
  const { data: post, error: postError } = await supabase
    .from("generated_posts")
    .select("*")
    .eq("id", postId)
    .eq("user_id", user.id)
    .single();

  if (!post || postError) {
    return fail(404, "Post not found");
  }

  // Publish to LinkedIn
  try {
    const publishResponse = await fetch(
      "https://api.linkedin.com/rest/posts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${linkedinAccount.access_token}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202401",
        },
        body: JSON.stringify({
          author: `urn:li:person:${linkedinAccount.linkedin_id}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: post.content,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      return fail(400, `Failed to publish to LinkedIn: ${error.message}`);
    }

    const publishedPost = await publishResponse.json();

    // Update post status in our database
    await supabase
      .from("generated_posts")
      .update({
        status: "published",
        linkedin_post_id: publishedPost.id,
        published_at: new Date().toISOString(),
      })
      .eq("id", postId);

    return ok({
      message: "Post published to LinkedIn successfully",
      linkedinPostId: publishedPost.id,
    });
  } catch (error: any) {
    return fail(500, `Failed to publish post: ${error.message}`);
  }
});
