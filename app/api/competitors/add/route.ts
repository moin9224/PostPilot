import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route } from "@/lib/api";
import { scrapeProfile } from "@/lib/linkedin-scraper";

const Body = z.object({
  linkedinProfileUrl: z.string().url("Provide a valid LinkedIn profile URL."),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { linkedinProfileUrl } = await parseBody(request, Body);

  // "Scrape" public data (placeholder — see lib/linkedin-scraper.ts).
  const profile = await scrapeProfile(linkedinProfileUrl);

  // Upsert the competitor row.
  const { data: competitor, error } = await supabase
    .from("competitors")
    .insert({
      user_id: user.id,
      linkedin_profile_url: linkedinProfileUrl,
      name: profile.name,
      industry: profile.industry,
      post_frequency: profile.postFrequency,
      avg_engagement: profile.avgEngagement,
      last_analyzed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  // Store their recent posts (ignore conflicts on linkedin_post_id).
  if (profile.posts.length > 0) {
    await supabase.from("competitor_posts").upsert(
      profile.posts.map((p) => ({
        competitor_id: competitor.id,
        linkedin_post_id: p.linkedinPostId,
        content: p.content,
        posted_at: p.postedAt,
        impressions: p.impressions,
        engagement: p.engagement,
        topic: p.topic,
      })),
      { onConflict: "linkedin_post_id", ignoreDuplicates: true },
    );
  }

  return ok(
    {
      competitorId: competitor.id,
      postCount: profile.posts.length,
      avgEngagement: profile.avgEngagement,
    },
    201,
  );
});
