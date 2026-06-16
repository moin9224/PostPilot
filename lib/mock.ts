import type {
  Competitor,
  CompetitorPost,
  MetricCard,
  Post,
  ReachIssue,
  Recommendation,
  TeamMember,
  TrendPoint,
  User,
} from "./types";

export const CURRENT_USER: User = {
  id: "u1",
  name: "John Doe",
  email: "john@acme.io",
  plan: "Pro",
  linkedinHandle: "johndoe",
  linkedinConnected: true,
};

const SAMPLE_TEXTS = [
  "The biggest mistake I made early in my career? Waiting for permission. Here's what changed everything when I stopped:",
  "Most people think productivity is about doing more. It's not. It's about doing less, better. 5 lessons I learned the hard way:",
  "We just shipped a feature that took 6 months. Here's the brutal truth about what slowed us down (and how we fixed it).",
  "Hiring is the highest-leverage thing you'll ever do. Yet most founders treat it like an afterthought. A thread on what I'd do differently:",
  "Your network isn't your net worth. Your reputation is. Here's how I think about building one that compounds:",
  "I analyzed 1,000 viral LinkedIn posts. The pattern is almost embarrassingly simple. Let me break it down:",
  "Remote work didn't kill culture. Bad management did. What actually builds trust across a distributed team:",
];

export const POSTS: Post[] = Array.from({ length: 24 }).map((_, i) => {
  const statuses: Post["status"][] = [
    "published",
    "scheduled",
    "draft",
    "published",
    "failed",
  ];
  const status = statuses[i % statuses.length];
  const day = ((i % 27) + 1).toString().padStart(2, "0");
  return {
    id: `p${i + 1}`,
    text: SAMPLE_TEXTS[i % SAMPLE_TEXTS.length],
    status,
    tone: (["Professional", "Casual", "Inspiring", "Educational"] as const)[i % 4],
    industry: ["Technology", "Marketing", "Sales", "Design"][i % 4],
    hashtags: ["#leadership", "#growth", "#linkedin"].slice(0, (i % 3) + 1),
    createdAt: `2026-06-${day}`,
    scheduledFor:
      status === "scheduled" || status === "published"
        ? `2026-06-${day}T09:00`
        : undefined,
    estimatedReach: 1200 + i * 137,
    stats:
      status === "published"
        ? {
            impressions: 4200 + i * 320,
            likes: 120 + i * 9,
            comments: 12 + i * 2,
            shares: 4 + i,
            engagementRate: Number((3 + (i % 5) * 0.6).toFixed(1)),
          }
        : undefined,
  };
});

export const DASHBOARD_METRICS: MetricCard[] = [
  { label: "Posts Published", value: "18", change: 12.5, icon: "Send" },
  { label: "Avg Engagement Rate", value: "4.8%", change: 3.2, icon: "Heart" },
  { label: "Reach This Month", value: "182K", change: 24.1, icon: "Eye" },
  { label: "New Followers", value: "1,204", change: -2.4, icon: "UserPlus" },
];

export const ANALYTICS_METRICS: MetricCard[] = [
  { label: "Total Impressions", value: "182,430", change: 24.1, icon: "Eye" },
  { label: "Total Engagement", value: "9,812", change: 11.8, icon: "Heart" },
  { label: "Engagement Rate", value: "4.8%", change: 3.2, icon: "Activity" },
  { label: "Avg Reach / Post", value: "7,601", change: 8.4, icon: "Radio" },
];

export const TREND_DATA: TrendPoint[] = [
  { label: "Mon", impressions: 18200, engagement: 820 },
  { label: "Tue", impressions: 24100, engagement: 1240 },
  { label: "Wed", impressions: 21800, engagement: 1080 },
  { label: "Thu", impressions: 28900, engagement: 1520 },
  { label: "Fri", impressions: 19400, engagement: 910 },
  { label: "Sat", impressions: 12200, engagement: 560 },
  { label: "Sun", impressions: 9800, engagement: 420 },
];

export const DOW_DATA = [
  { label: "Mon", value: 3.9 },
  { label: "Tue", value: 5.2 },
  { label: "Wed", value: 4.8 },
  { label: "Thu", value: 5.6 },
  { label: "Fri", value: 4.1 },
  { label: "Sat", value: 2.4 },
  { label: "Sun", value: 1.9 },
];

export const COMPETITORS: Competitor[] = [
  {
    id: "c1",
    name: "Sara Lin",
    handle: "saralin",
    industry: "Marketing",
    postFrequency: 5,
    avgEngagement: 6.2,
    followers: 48200,
    topTopics: ["Branding", "Storytelling", "Growth"],
  },
  {
    id: "c2",
    name: "Marcus Reid",
    handle: "marcusreid",
    industry: "Technology",
    postFrequency: 3,
    avgEngagement: 4.9,
    followers: 31500,
    topTopics: ["AI", "Startups", "Engineering"],
  },
  {
    id: "c3",
    name: "Priya Nair",
    handle: "priyanair",
    industry: "Sales",
    postFrequency: 4,
    avgEngagement: 5.5,
    followers: 27800,
    topTopics: ["Cold Outreach", "SaaS", "Negotiation"],
  },
];

export const COMPETITOR_POSTS: CompetitorPost[] = [
  {
    id: "cp1",
    competitorName: "Sara Lin",
    text: "Your brand is not your logo. It's the feeling people get when they hear your name. 7 ways to engineer that feeling:",
    likes: 3120,
    comments: 284,
    postedAt: "2026-06-10",
  },
  {
    id: "cp2",
    competitorName: "Marcus Reid",
    text: "AI won't take your job. Someone using AI will. Here's the exact workflow my team adopted this quarter:",
    likes: 2890,
    comments: 198,
    postedAt: "2026-06-08",
  },
  {
    id: "cp3",
    competitorName: "Priya Nair",
    text: "I closed $1.2M in Q1 with cold outreach. Not a single cold call. Here's the email framework that did it:",
    likes: 4210,
    comments: 367,
    postedAt: "2026-06-05",
  },
];

export const REACH_ISSUES: ReachIssue[] = [
  {
    id: "r1",
    severity: "critical",
    title: "Posting frequency too low",
    problem: "You're posting once per week on average.",
    why: "LinkedIn rewards consistency. Low frequency means the algorithm rarely surfaces your content.",
    fix: "Increase to 3–4 posts per week using the content calendar.",
    expectedImprovement: "+120% reach within 4 weeks",
  },
  {
    id: "r2",
    severity: "warning",
    title: "Weak first lines (hooks)",
    problem: "60% of your posts open with a generic sentence.",
    why: "The first 2 lines decide whether readers click 'see more'.",
    fix: "Lead with a bold claim, a question, or a surprising stat.",
    expectedImprovement: "+35% dwell time",
  },
  {
    id: "r3",
    severity: "warning",
    title: "Inconsistent posting times",
    problem: "Posts go out at random hours.",
    why: "Posting when your audience is offline buries early engagement.",
    fix: "Schedule for Tue–Thu, 9am in your audience's timezone.",
    expectedImprovement: "+22% early engagement",
  },
  {
    id: "r4",
    severity: "good",
    title: "Profile completeness",
    problem: "Your profile is 100% complete.",
    why: "A complete profile builds trust and boosts discoverability.",
    fix: "Keep it up — review your headline quarterly.",
    expectedImprovement: "Maintaining strong baseline",
  },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec1",
    text: "Increase posts to 3x/week to roughly double your monthly reach.",
    impact: "High",
  },
  {
    id: "rec2",
    text: "Use 2–3 industry keywords naturally in the first paragraph.",
    impact: "High",
  },
  {
    id: "rec3",
    text: "Post Tuesday–Thursday around 9am for peak audience activity.",
    impact: "Medium",
  },
  {
    id: "rec4",
    text: "End posts with a clear question to drive comments.",
    impact: "Medium",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "t1",
    name: "John Doe",
    email: "john@acme.io",
    role: "Admin",
    status: "active",
  },
  {
    id: "t2",
    name: "Amelia Cruz",
    email: "amelia@acme.io",
    role: "Editor",
    status: "active",
  },
  {
    id: "t3",
    name: "Devon Park",
    email: "devon@acme.io",
    role: "Viewer",
    status: "pending",
  },
];

/** Deterministic fake generator so the demo "AI" returns plausible posts. */
export function generateMockPosts(topic: string, count = 7) {
  const templates = [
    (t: string) =>
      `Everyone talks about ${t}. Almost nobody does it well. Here are 5 things that actually move the needle:`,
    (t: string) =>
      `I spent 3 years getting ${t} wrong so you don't have to. The lessons that finally clicked:`,
    (t: string) =>
      `Unpopular opinion: ${t} is simpler than the gurus make it sound. Proof:`,
    (t: string) =>
      `The fastest way to improve at ${t}? Stop doing these 3 things today.`,
    (t: string) =>
      `${t} changed how I work. Here's the exact system I use, step by step:`,
    (t: string) =>
      `If I had to restart with ${t} from zero, this is the 30-day plan I'd follow:`,
    (t: string) =>
      `Most advice on ${t} is recycled. Here's what nobody tells you:`,
  ];
  const subject = topic.trim() || "your craft";
  return Array.from({ length: count }).map((_, i) => {
    const text = templates[i % templates.length](subject);
    return {
      id: `g${i + 1}`,
      text,
      characterCount: text.length,
      estimatedReach: 2400 + i * 410,
      hashtags: ["#linkedin", "#growth", "#career"].slice(0, (i % 3) + 1),
    };
  });
}
