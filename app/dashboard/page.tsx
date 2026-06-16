import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
  BarChart3,
  Users,
  Send,
  Eye,
  Heart,
  MessageCircle,
  Linkedin,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import StatusBadge from "@/components/Common/StatusBadge";
import EngagementMetrics from "@/components/Analytics/EngagementMetrics";
import PerformanceChart from "@/components/Analytics/PerformanceChart";
import { DASHBOARD_METRICS, POSTS, TREND_DATA } from "@/lib/mock";
import { formatDate, formatTime, truncate } from "@/lib/utils";
import { getServerSupabase } from "@/lib/supabase-server";

const TRENDING = [
  { topic: "AI in the workplace", delta: "+312%", icon: "🤖" },
  { topic: "Remote team culture", delta: "+184%", icon: "🏢" },
  { topic: "Personal branding", delta: "+126%", icon: "⭐" },
  { topic: "Founder lessons", delta: "+88%", icon: "📚" },
  { topic: "Hiring & retention", delta: "+64%", icon: "👥" },
];

export default async function DashboardHome() {
  const upcoming = POSTS.filter((p) => p.status === "scheduled").slice(0, 3);
  const recent = POSTS.filter((p) => p.status === "published").slice(0, 3);

  // Fetch LinkedIn connection status from database
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let linkedinAccount: any = null;
  if (user) {
    const { data } = await supabase
      .from("user_linkedin_accounts")
      .select("profile_name, profile_email, profile_photo_url, linkedin_id, token_expires_at, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    linkedinAccount = data;
  }

  const isLinkedinConnected = Boolean(linkedinAccount);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink to-neutral-900 p-8 text-white md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-action/20 blur-3xl"
        />

        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20">
              <Flame className="h-5 w-5 text-orange-300" />
            </div>
            <span className="text-sm font-medium text-white/80">
              On a 7-day streak 🔥
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
                Welcome back.
              </h1>
              <p className="mt-3 text-lg text-white/70">
                Your reach is up <span className="font-semibold text-white">+24%</span> this month with
                <span className="font-semibold text-white"> 3 posts</span> queued.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/content-generator" className="flex-1">
                <Button className="w-full bg-white text-ink hover:bg-white/90">
                  <Sparkles className="h-4 w-4" />
                  Generate post
                </Button>
              </Link>
              <Link href="/dashboard/calendar">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LinkedIn Connection Card */}
      {isLinkedinConnected ? (
        <section className="rounded-xl border border-green-200 bg-green-50/50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {linkedinAccount.profile_photo_url ? (
                <img
                  src={linkedinAccount.profile_photo_url}
                  alt={linkedinAccount.profile_name || "LinkedIn"}
                  className="h-10 w-10 rounded-full object-cover border-2 border-green-200"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-ink">
                    {linkedinAccount.profile_name || "LinkedIn Account"}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  {linkedinAccount.profile_email || "Ready to publish & track analytics"}
                </p>
              </div>
            </div>
            <a href="/api/auth/linkedin/authorize">
              <Button variant="secondary" className="text-xs">
                Reconnect
              </Button>
            </a>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Linkedin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-ink">LinkedIn Connection</h3>
                <p className="text-xs text-neutral-600">Connect your account to post and track analytics</p>
              </div>
            </div>
            <a href="/api/auth/linkedin/authorize">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <CheckCircle2 className="h-4 w-4" />
                Connect LinkedIn
              </Button>
            </a>
          </div>
        </section>
      )}

      {/* Key Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Posts this month"
          value="18"
          change="+12.5%"
          icon={<Send className="h-5 w-5" />}
          trend="up"
        />
        <StatCard
          label="Total reach"
          value="182K"
          change="+24%"
          icon={<Eye className="h-5 w-5" />}
          trend="up"
        />
        <StatCard
          label="Avg engagement"
          value="4.8%"
          change="+3.2%"
          icon={<Heart className="h-5 w-5" />}
          trend="up"
        />
        <StatCard
          label="New followers"
          value="1,204"
          change="-2.4%"
          icon={<Users className="h-5 w-5" />}
          trend="down"
        />
      </section>

      {/* Chart and Trending Section */}
      <section className="grid gap-5 lg:grid-cols-3">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">
                Reach performance
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Track your reach over time
              </p>
            </div>
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
              {["7d", "30d", "90d"].map((period) => (
                <button
                  key={period}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                    period === "7d"
                      ? "bg-white text-ink shadow-sm"
                      : "text-neutral-500 hover:text-ink"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <PerformanceChart data={TREND_DATA} />
        </Card>

        {/* Trending Topics */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">
                Trending topics
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                In your industry
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>

          <div className="space-y-2">
            {TRENDING.map((topic, index) => (
              <button
                key={topic.topic}
                className="group flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-neutral-50"
              >
                <span className="text-lg">{topic.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-ink group-hover:text-brand">
                    {topic.topic}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Rank #{index + 1}
                  </p>
                </div>
                <span className="text-sm font-semibold text-success">
                  {topic.delta}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/dashboard/content-generator"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand transition-colors hover:text-action"
          >
            Generate post
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </section>

      {/* Upcoming and Recent Posts */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Upcoming Posts */}
        <Card padded={false}>
          <div className="border-b border-neutral-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Scheduled posts
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Queue for this week
                </p>
              </div>
              <Link
                href="/dashboard/calendar"
                className="text-xs font-medium text-brand transition-colors hover:text-action"
              >
                View all →
              </Link>
            </div>
          </div>

          {upcoming.length > 0 ? (
            <ul className="divide-y divide-neutral-100">
              {upcoming.map((post) => (
                <li
                  key={post.id}
                  className="group flex items-start gap-4 px-6 py-4 transition-colors hover:bg-neutral-50/70"
                >
                  <div className="flex flex-shrink-0 flex-col items-center rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-2">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="mt-1 text-[9px] font-semibold text-neutral-600">
                      {post.scheduledFor && formatTime(post.scheduledFor)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed text-ink line-clamp-2">
                      {truncate(post.text, 80)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                      <span>
                        {post.scheduledFor && formatDate(post.scheduledFor)}
                      </span>
                      <span>•</span>
                      <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
                        {post.tone}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={post.status} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-neutral-500">No scheduled posts yet</p>
              <Link href="/dashboard/content-generator">
                <Button size="sm" className="mt-3 mx-auto w-fit">
                  <Sparkles className="h-3.5 w-3.5" />
                  Create one now
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Recent Posts */}
        <Card padded={false}>
          <div className="border-b border-neutral-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Recent activity
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Published posts
                </p>
              </div>
              <Link
                href="/dashboard/analytics"
                className="text-xs font-medium text-brand transition-colors hover:text-action"
              >
                View all →
              </Link>
            </div>
          </div>

          {recent.length > 0 ? (
            <ul className="divide-y divide-neutral-100">
              {recent.map((post) => (
                <li
                  key={post.id}
                  className="group flex flex-col px-6 py-4 transition-colors hover:bg-neutral-50/70"
                >
                  <p className="text-sm leading-relaxed text-ink line-clamp-2">
                    {truncate(post.text, 100)}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[11px] text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.stats?.impressions.toLocaleString() || "0"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-rose-500" />
                        {Math.round(
                          (post.stats?.impressions || 0) * 0.048
                        ).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {Math.round(
                          (post.stats?.impressions || 0) * 0.015
                        ).toLocaleString()}
                      </span>
                    </div>
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                      {post.stats?.engagementRate}% eng.
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-neutral-500">No published posts yet</p>
            </div>
          )}
        </Card>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-8">
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-ink">
            Ready to maximize your reach?
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            Use our AI-powered generator to create posts that resonate with your audience.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/content-generator">
              <Button className="bg-ink hover:bg-neutral-800">
                <Sparkles className="h-4 w-4" />
                Generate post
              </Button>
            </Link>
            <Link href="/dashboard/reach-debugger">
              <Button variant="secondary">
                <BarChart3 className="h-4 w-4" />
                Analyze reach
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

function StatCard({ label, value, change, icon, trend }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
          <p
            className={`mt-2 text-xs font-medium ${
              trend === "up" ? "text-success" : "text-rose-600"
            }`}
          >
            {change} vs last period
          </p>
        </div>
        <div
          className={`rounded-lg p-3 ${
            trend === "up"
              ? "bg-success/10 text-success"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
