import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route } from "@/lib/api";
import { generateLinkedInPosts } from "@/lib/anthropic";
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
  count: z.number().int().min(1).max(7),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const params = await parseBody(request, Body);

  // Look up the plan, then enforce the per-plan daily generation cap.
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.subscription_plan ?? "free") as SubscriptionPlan;
  const usage = await getDailyGenerationUsage(supabase, user.id, plan);
  assertWithinLimit(usage, params.count);

  // Generate with Claude (structured output → guaranteed-parseable JSON).
  const posts = await generateLinkedInPosts(params);

  // Persist each generated post as a draft so it lands in the library.
  const rows = posts.map((p) => ({
    user_id: user.id,
    content: p.content,
    tone: params.tone,
    industry: params.industry,
    audience: params.audience,
    status: "draft" as const,
    character_count: p.characterCount,
    hashtags: p.hashtags,
    estimated_reach: p.estimatedReach,
    ai_generated: true,
  }));

  const { data: saved, error } = await supabase
    .from("generated_posts")
    .insert(rows)
    .select("id");

  if (error) {
    // Generation succeeded even if persistence failed — still return posts.
    console.error("[generate-content] save failed:", error.message);
  }

  // Merge DB ids back in (order preserved by insert).
  const withIds = posts.map((p, i) => ({ id: saved?.[i]?.id ?? null, ...p }));

  return ok({ posts: withIds, usage });
});
