// Public LinkedIn profile scraping is heavily restricted and against
// LinkedIn's ToS to do via unofficial means. In production this would be
// backed by the official LinkedIn API + an authorized integration, or a
// compliant third-party data provider. For now this module returns
// deterministic placeholder data so the rest of the system is testable.

export interface ScrapedProfile {
  name: string;
  industry: string;
  postFrequency: number; // posts per week
  avgEngagement: number; // percent
  posts: ScrapedPost[];
}

export interface ScrapedPost {
  linkedinPostId: string;
  content: string;
  postedAt: string;
  impressions: number;
  engagement: number;
  topic: string;
}

/** Derive a display name from a LinkedIn profile URL slug. */
export function nameFromUrl(url: string): string {
  const slug = url.replace(/\/+$/, "").split("/").pop() ?? "competitor";
  return slug
    .replace(/[-_]\d+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Placeholder "scrape". Returns plausible analytics for a profile URL.
 * Replace with a compliant data source before going to production.
 */
export async function scrapeProfile(url: string): Promise<ScrapedProfile> {
  const name = nameFromUrl(url);
  const topics = ["Leadership", "Growth", "AI", "Career", "Marketing"];
  const posts: ScrapedPost[] = Array.from({ length: 5 }).map((_, i) => ({
    linkedinPostId: `${encodeURIComponent(url)}-${i}`,
    content: `Sample post ${i + 1} from ${name} about ${topics[i % topics.length]}.`,
    postedAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    impressions: 3000 + i * 800,
    engagement: 120 + i * 40,
    topic: topics[i % topics.length],
  }));

  return {
    name,
    industry: "Unknown",
    postFrequency: 3 + (name.length % 3),
    avgEngagement: Number((4 + (name.length % 4) * 0.5).toFixed(1)),
    posts,
  };
}
