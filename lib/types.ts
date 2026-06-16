// ============================================================================
// Domain types for the LinkedIn Content Creator app
// ============================================================================

export type Tone = "Professional" | "Casual" | "Inspiring" | "Educational";
export type Length = "Short" | "Medium" | "Long";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type Role = "Admin" | "Editor" | "Viewer";
export type IssueSeverity = "critical" | "warning" | "good";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: "Starter" | "Pro" | "Agency";
  linkedinHandle?: string;
  linkedinConnected: boolean;
}

export interface EngagementStats {
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  /** engagement rate as a percentage, e.g. 4.2 */
  engagementRate: number;
}

export interface Post {
  id: string;
  text: string;
  status: PostStatus;
  tone?: Tone;
  industry?: string;
  hashtags: string[];
  /** ISO date string */
  createdAt: string;
  /** ISO date string for the scheduled/published time */
  scheduledFor?: string;
  estimatedReach?: number;
  stats?: EngagementStats;
}

export interface GeneratedPost {
  id: string;
  text: string;
  characterCount: number;
  estimatedReach: number;
  hashtags: string[];
  suggestedBestTime?: string;
  tone?: string;
  industry?: string;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  industry: string;
  avatarUrl?: string;
  /** posts per week */
  postFrequency: number;
  avgEngagement: number;
  followers: number;
  topTopics: string[];
}

export interface CompetitorPost {
  id: string;
  competitorName: string;
  text: string;
  likes: number;
  comments: number;
  postedAt: string;
}

export interface ReachIssue {
  id: string;
  severity: IssueSeverity;
  title: string;
  problem: string;
  why: string;
  fix: string;
  expectedImprovement: string;
}

export interface Recommendation {
  id: string;
  text: string;
  impact: "High" | "Medium" | "Low";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "pending";
}

export interface MetricCard {
  label: string;
  value: string;
  /** percentage change vs previous period, e.g. +12.4 */
  change: number;
  icon?: string;
}

export interface TrendPoint {
  label: string;
  impressions: number;
  engagement: number;
}

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Industry {
  value: string;
  label: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
