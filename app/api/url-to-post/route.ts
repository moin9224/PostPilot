import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route, ApiError } from "@/lib/api";
import { convertURLToLinkedInPost } from "@/lib/url-to-post";

const Body = z.object({
  url: z.string().url("Must be a valid URL"),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const params = await parseBody(request, Body);

  try {
    // Get Gemini API key from user's stored keys
    const { data: apiKeys } = await supabase
      .from("user_api_keys")
      .select("key")
      .eq("user_id", user.id)
      .eq("provider", "gemini")
      .limit(1);

    if (!apiKeys || apiKeys.length === 0) {
      throw new ApiError(
        400,
        "No Gemini API key found. Please add one in settings."
      );
    }

    const post = await convertURLToLinkedInPost(params.url, apiKeys[0].key);

    // Save the conversion to database
    const { data: saved, error } = await supabase
      .from("generated_posts")
      .insert({
        user_id: user.id,
        content: post.content,
        source_url: params.url,
        tone: "professional",
        industry: "General",
        audience: "Professionals",
        status: "draft",
        character_count: post.content.length,
        hashtags: post.hashtags,
        estimated_reach: post.estimatedReach,
        ai_generated: true,
      })
      .select("id");

    if (error) {
      console.error("Database error:", error);
      throw new ApiError(500, "Failed to save post");
    }

    return ok({
      id: saved?.[0]?.id,
      content: post.content,
      variations: post.variations,
      hashtags: post.hashtags,
      estimatedReach: post.estimatedReach,
      sourceUrl: params.url,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Failed to convert URL to post";
    throw new ApiError(500, message);
  }
});
