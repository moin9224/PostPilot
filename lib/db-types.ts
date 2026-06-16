// Row shapes for the Supabase tables. These mirror supabase/schema.sql.
// Keeping them hand-written (rather than generated) keeps the example
// self-contained; swap for `supabase gen types` output in a real project.

export type SubscriptionPlan = "free" | "starter" | "pro" | "agency";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type ScheduledStatus = "scheduled" | "published" | "failed";
export type TeamRole = "admin" | "editor" | "viewer";
export type TeamStatus = "pending" | "active" | "inactive";

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  industry: string | null;
  profile_picture_url: string | null;
  linkedin_profile_url: string | null;
  linkedin_access_token: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_started_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedPostRow {
  id: string;
  user_id: string;
  content: string;
  tone: string | null;
  industry: string | null;
  audience: string | null;
  status: PostStatus;
  scheduled_for: string | null;
  published_at: string | null;
  linkedin_post_id: string | null;
  impressions: number;
  clicks: number;
  comments: number;
  shares: number;
  reactions: number;
  character_count: number | null;
  hashtags: string[] | null;
  estimated_reach: number | null;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduledPostRow {
  id: string;
  user_id: string;
  post_id: string | null;
  content: string;
  scheduled_for: string;
  timezone: string;
  status: ScheduledStatus;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberRow {
  id: string;
  user_id: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  joined_at: string | null;
  created_at: string;
}


