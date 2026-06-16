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
      "Content library",
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
      "Competitor research",
      "Reach debugger",
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
    icon: "Users",
    title: "Competitor Research",
    description:
      "See what's working for others in your niche and steal the best ideas.",
  },
  {
    icon: "Stethoscope",
    title: "Reach Debugger",
    description:
      "Diagnose why your reach is stuck and get a prioritized fix-it list.",
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
      "Describe your topic, pick a tone and industry, and our AI (powered by Claude) drafts multiple ready-to-post variations complete with hashtags and a reach estimate.",
  },
  {
    question: "Can I schedule and auto-publish posts?",
    answer:
      "Yes. Build your content calendar, pick the best times, and we'll publish automatically to your connected LinkedIn account.",
  },
  {
    question: "Is it safe to connect my LinkedIn account?",
    answer:
      "We use LinkedIn's official APIs and OAuth. We never store your password and you can disconnect at any time.",
  },
  {
    question: "What is the Reach Debugger?",
    answer:
      "It audits your profile, posting habits, and content quality, then gives you a prioritized list of fixes with expected impact on your reach.",
  },
  {
    question: "Can my whole team use it?",
    answer:
      "On the Agency plan you can invite up to 20 teammates with Admin, Editor, and Viewer roles.",
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
  {
    label: "Competitor Research",
    href: "/dashboard/competitor-research",
    icon: "Users",
  },
  {
    label: "Reach Debugger",
    href: "/dashboard/reach-debugger",
    icon: "Stethoscope",
  },
  {
    label: "Content Library",
    href: "/dashboard/content-library",
    icon: "Library",
  },
  { label: "Team", href: "/dashboard/team", icon: "UsersRound" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];
