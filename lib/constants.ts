import type {
  FaqItem,
  Industry,
  NavItem,
  PricingTier,
  Tone,
} from "./types";

// ----------------------------------------------------------------------------
// Color tokens (mirror tailwind.config.ts so they can be used inline in JS,
// e.g. for chart fills where Tailwind classes can't reach).
// ----------------------------------------------------------------------------
export const COLORS = {
  primary: "#0077b5",
  secondary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  dark: "#1F2937",
  light: "#F3F4F6",
  border: "#E5E7EB",
  muted: "#6B7280",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// ----------------------------------------------------------------------------
// Generation controls
// ----------------------------------------------------------------------------
export const TONES: Tone[] = [
  "Professional",
  "Casual",
  "Inspiring",
  "Educational",
];

export const LENGTHS = ["Short", "Medium", "Long"] as const;

export const INDUSTRIES: Industry[] = [
  { value: "tech", label: "Technology" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "design", label: "Design" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "consulting", label: "Consulting" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "realestate", label: "Real Estate" },
];

export const AUDIENCES: Industry[] = [
  { value: "founders", label: "Founders & Executives" },
  { value: "marketers", label: "Marketers" },
  { value: "developers", label: "Developers" },
  { value: "jobseekers", label: "Job Seekers" },
  { value: "investors", label: "Investors" },
  { value: "general", label: "General Professionals" },
];

// ----------------------------------------------------------------------------
// Marketing content
// ----------------------------------------------------------------------------
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: 29,
    period: "/month",
    description: "For solo creators getting serious about LinkedIn.",
    features: [
      "AI content generation (100/mo)",
      "Smart scheduling",
      "Basic analytics",
      "1 LinkedIn account",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: 79,
    period: "/month",
    description: "For power users who want growth on autopilot.",
    features: [
      "Unlimited AI generation",
      "Advanced scheduling",
      "Full analytics suite",

      "3 LinkedIn accounts",
    ],
    highlighted: true,
    cta: "Start Free",
  },
  {
    name: "Agency",
    price: 299,
    period: "/month",
    description: "For teams and agencies managing many clients.",
    features: [
      "Everything in Pro",
      "Team collaboration (up to 20)",
      "Unlimited accounts",
      "Admin controls",
      "White-label reports",
      "Priority support",
    ],
    cta: "Contact Sales",
  },
];

export const FEATURES = [
  {
    icon: "Sparkles",
    title: "AI Content Generation",
    description:
      "Generate scroll-stopping LinkedIn posts in seconds, tuned to your voice and industry.",
  },
  {
    icon: "CalendarClock",
    title: "Smart Scheduling",
    description:
      "Queue posts for the optimal time and let auto-publishing handle the rest.",
  },
  {
    icon: "BarChart3",
    title: "Analytics & Insights",
    description:
      "Track impressions, engagement, and reach with clear, actionable dashboards.",
  },
  {
    icon: "UsersRound",
    title: "Team Collaboration",
    description:
      "Invite teammates, assign roles, and ship content together at scale.",
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "How does the AI content generation work?",
    answer:
      "You describe your topic, pick a tone and length, and PostPilot generates three ready-to-post variations in your voice. Each one comes with a predicted reach score so you can pick the strongest draft before you even hit publish.",
  },
  {
    question: "Will the posts actually sound like me?",
    answer:
      "Yes. The more you use PostPilot, the better it learns your style: your vocabulary, sentence length, and the way you open a hook. You can also paste in past posts to seed your voice profile from day one.",
  },
  {
    question: "Can I schedule and auto-publish posts?",
    answer:
      "Absolutely. Build your content calendar, set your preferred posting cadence, and PostPilot publishes automatically at the times your audience is most active. You can also override any slot manually.",
  },
  {
    question: "Is it safe to connect my LinkedIn account?",
    answer:
      "We use LinkedIn's official OAuth API, the same standard used by every major scheduling tool. We never see or store your password. You can revoke access from your LinkedIn settings or from inside PostPilot at any time.",
  },
  {
    question: "What is the Reach Debugger?",
    answer:
      "The Reach Debugger analyses your past posts and tells you exactly why a post underperformed: the hook, the posting time, the format, or the topic. It gives you a clear action to fix it, not just a vague score.",
  },
  {
    question: "Can my whole team use PostPilot?",
    answer:
      "Yes. The Agency plan supports up to 20 seats with role-based access (Admin, Editor, Viewer), approval workflows so nothing goes live without sign-off, and a shared content library for on-brand assets.",
  },
  {
    question: "Do I need to be a professional writer to use this?",
    answer:
      "Not at all. PostPilot is built for founders, operators, and subject-matter experts: people with things worth saying who don't want to spend two hours saying them. The AI handles the craft; you supply the ideas.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "You get 7 days of full Pro access with no credit card required. If you decide to upgrade, your content, settings, and voice profile carry over automatically. If not, no charge, no hassle.",
  },
  {
    question: "Can I cancel any time?",
    answer:
      "Yes. Cancel from your account settings in seconds. You keep access until the end of your billing period and we never charge you again after that. No cancellation fees, no lengthy forms.",
  },
  {
    question: "What analytics does PostPilot provide?",
    answer:
      "You get impressions, reactions, comments, reposts, and follower growth, all in one dashboard. You can filter by post type, topic, and time range to spot exactly what content drives results for your specific audience.",
  },
];

// ----------------------------------------------------------------------------
// Dashboard navigation
// ----------------------------------------------------------------------------
export const SIDEBAR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  {
    label: "Content Generator",
    href: "/dashboard/content-generator",
    icon: "Sparkles",
  },
  { label: "Calendar", href: "/dashboard/calendar", icon: "CalendarDays" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
  { label: "Templates", href: "/dashboard/templates", icon: "FileText" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];
