import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route, ApiError } from "@/lib/api";
import { generateLinkedInPost } from "@/lib/openai";
import {
  assertWithinLimit,
  getDailyGenerationUsage,
} from "@/lib/rate-limit";
import type { SubscriptionPlan } from "@/lib/db-types";

const Body = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  tone: z.enum(["professional", "casual", "inspiring", "educational"]),
  industry: z.string().min(1),
  audience: z.string().min(1),
  style: z.enum(["short", "medium", "long"]),
  format: z.string().optional(),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const params = await parseBody(request, Body);

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan ?? "free") as SubscriptionPlan;
  const usage = await getDailyGenerationUsage(supabase, user.id, plan);

  try {
    assertWithinLimit(usage, 1);
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) {
      // Return usage info with the error so the frontend can show upgrade modal
      throw new ApiError(429, err.message, { usage });
    }
    throw err;
  }

  const post = await generateLinkedInPost(params);

  const { data: saved, error } = await supabase
    .from("generated_posts")
    .insert({
      user_id: user.id,
      content: post.content,
      tone: params.tone,
      industry: params.industry,
      audience: params.audience,
      status: "draft" as const,
      character_count: post.characterCount,
      hashtags: post.hashtags,
      estimated_reach: post.estimatedReach,
      ai_generated: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[generate-content] save failed:", error.message);
  }

  return ok({
    posts: [{ id: saved?.id ?? null, ...post }],
    usage,
  });
});
