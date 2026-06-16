import { z } from "zod";
import { ApiError, ok, parseBody, preflight, requireUser, route } from "@/lib/api";

const Body = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).optional(),
});

export const OPTIONS = () => preflight();

/**
 * Direct programmatic posting to LinkedIn is restricted. We support a
 * manual-publish flow: mark the post published and return a 1-click LinkedIn
 * share link the user (or a browser extension) can open to post. When an
 * official LinkedIn integration is connected, this is where the API call
 * would go instead.
 */
export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { postId, content } = await parseBody(request, Body);

  const { data: post, error } = await supabase
    .from("generated_posts")
    .select("id, content")
    .eq("id", postId)
    .eq("user_id", user.id)
    .single();

  if (error || !post) throw new ApiError(404, "Post not found.");

  const text = content ?? post.content;
  const shareUrl =
    "https://www.linkedin.com/feed/?shareActive=true&text=" +
    encodeURIComponent(text);

  // Simulated LinkedIn id; a real integration would store the returned URN.
  const linkedinPostId = `manual-${post.id}`;

  const { error: updErr } = await supabase
    .from("generated_posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      linkedin_post_id: linkedinPostId,
    })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (updErr) throw new Error(updErr.message);

  return ok({ success: true, linkedinPostId, shareUrl });
});
