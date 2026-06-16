import type { GeneratedPostRow, ProfileRow } from "./db-types";
import type { ReachAnalysisData, ReachIssueData } from "./db-types";

/**
 * Heuristic reach analysis over a user's profile + recent posts.
 * Pure function — no AI call — so it's fast and deterministic.
 */
export function analyzeReach(
  profile: ProfileRow,
  posts: GeneratedPostRow[],
): ReachAnalysisData {
  const issues: ReachIssueData[] = [];
  const published = posts.filter((p) => p.status === "published");

  // --- Posting frequency (posts in the last 30 days) ---
  const cutoff = Date.now() - 30 * 86400000;
  const recent = published.filter(
    (p) => new Date(p.published_at ?? p.created_at).getTime() >= cutoff,
  );
  const perWeek = recent.length / 4.3;
  if (perWeek < 1) {
    issues.push({
      severity: "critical",
      title: "Posting frequency too low",
      description: `You've published ~${perWeek.toFixed(1)} posts/week recently.`,
      recommendation: "Increase to 3–4 posts per week using the content calendar.",
      expectedImprovement: "+120% reach within 4 weeks",
    });
  } else if (perWeek < 3) {
    issues.push({
      severity: "warning",
      title: "Posting frequency below optimal",
      description: `You're at ~${perWeek.toFixed(1)} posts/week.`,
      recommendation: "Aim for 3–4 posts/week for consistent algorithm favor.",
      expectedImprovement: "+40% reach",
    });
  } else {
    issues.push({
      severity: "info",
      title: "Healthy posting cadence",
      description: `~${perWeek.toFixed(1)} posts/week is in the optimal range.`,
      recommendation: "Maintain consistency and focus on hook quality.",
      expectedImprovement: "Sustained baseline",
    });
  }

  // --- Engagement rate ---
  const withImpressions = published.filter((p) => p.impressions > 0);
  if (withImpressions.length > 0) {
    const avgRate =
      withImpressions.reduce((sum, p) => {
        const eng = p.reactions + p.comments + p.shares;
        return sum + (eng / p.impressions) * 100;
      }, 0) / withImpressions.length;
    if (avgRate < 2) {
      issues.push({
        severity: "warning",
        title: "Engagement rate below average",
        description: `Your average engagement rate is ${avgRate.toFixed(1)}%.`,
        recommendation: "Open with stronger hooks and end with a clear question.",
        expectedImprovement: "+35% engagement",
      });
    }
  }

  // --- Profile completeness ---
  const complete = !!(
    profile.full_name &&
    profile.industry &&
    profile.company &&
    profile.linkedin_profile_url
  );
  if (!complete) {
    issues.push({
      severity: "warning",
      title: "Incomplete profile",
      description: "Some profile fields (name, company, industry, LinkedIn URL) are missing.",
      recommendation: "Complete your profile to build trust and discoverability.",
      expectedImprovement: "+15% profile visits",
    });
  } else {
    issues.push({
      severity: "info",
      title: "Profile is complete",
      description: "Your profile has all key fields filled in.",
      recommendation: "Review your headline quarterly.",
      expectedImprovement: "Strong baseline",
    });
  }

  // --- Hashtag usage ---
  const noHashtags = published.filter((p) => !p.hashtags || p.hashtags.length === 0);
  if (published.length > 0 && noHashtags.length / published.length > 0.5) {
    issues.push({
      severity: "warning",
      title: "Inconsistent hashtag strategy",
      description: "More than half your posts use no hashtags.",
      recommendation: "Use 3–5 targeted industry hashtags per post.",
      expectedImprovement: "+18% discoverability",
    });
  }

  // --- Score: start at 100, subtract per severity ---
  const score = Math.max(
    0,
    100 -
      issues.filter((i) => i.severity === "critical").length * 25 -
      issues.filter((i) => i.severity === "warning").length * 10,
  );

  const recommendations = [
    "Post Tuesday–Thursday around 9am in your audience's timezone.",
    "Lead every post with a bold claim, question, or surprising stat.",
    "Reply to comments within the first hour to boost distribution.",
    "Use 2–3 industry keywords naturally in the first paragraph.",
  ];

  return { score, issues, recommendations };
}
