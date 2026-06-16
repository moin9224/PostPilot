import type {
  MetricCard,
  Post,
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
