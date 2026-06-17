import { fail, ok, route, parseBody } from "@/lib/api";
import { getServerSupabase } from "@/lib/supabase-server";
import { publishToLinkedIn } from "@/lib/linkedin";
import { z } from "zod";

const Body = z.object({
  postId: z.string().optional(),
  content: z.string().optional(),
  scheduledFor: z.string().optional(),
});

/**
 * Publishes a post to LinkedIn using the Share on LinkedIn API.
 *
 * - If `scheduledFor` is a future timestamp, the post is stored in
 *   `scheduled_posts_v2` with status `scheduled`; the cron worker
 *   (`/api/cron/publish-scheduled`) publishes it when due.
 * - Otherwise it is published immediately via the shared `publishToLinkedIn`
 *   helper — the same code path the cron worker uses.
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

  // If scheduled for the future, store it for the cron worker to publish later.
  if (scheduledFor) {
    const scheduledDate = new Date(scheduledFor);
    if (Number.isNaN(scheduledDate.getTime())) {
      return fail(400, "scheduledFor is not a valid date");
    }
    if (scheduledDate > new Date()) {
      const { error: insertError } = await supabase
        .from("scheduled_posts_v2")
        .insert({
          user_id: user.id,
          // Required FK — without it the insert violates NOT NULL and the
          // schedule silently fails. Bind the post to the account that will
          // publish it.
          linkedin_account_id: linkedinAccount.id,
          text: postContent,
          scheduled_for: scheduledDate.toISOString(),
          status: "scheduled",
        });

      if (insertError) {
        return fail(500, `Failed to schedule post: ${insertError.message}`);
      }

      return ok({ message: "Post scheduled successfully", scheduledFor: scheduledDate.toISOString() });
    }
  }

  // Publish immediately via the shared helper.
  const result = await publishToLinkedIn(linkedinAccount, postContent);

  if (!result.ok) {
    const status = result.code === "TOKEN_EXPIRED" ? 401 : 400;
    return fail(status, result.error);
  }

  // Update post status in database if postId provided
  if (postId) {
    await supabase
      .from("generated_posts")
      .update({
        status: "published",
        linkedin_post_id: result.linkedinPostId,
        published_at: new Date().toISOString(),
      })
      .eq("id", postId);
  }

  return ok({
    message: "Post published to LinkedIn successfully",
    linkedinPostId: result.linkedinPostId,
  });
});
