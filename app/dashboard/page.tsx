import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  BarChart3,
  Users,
  Send,
  Eye,
  Heart,
  Linkedin,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import StatusBadge from "@/components/Common/StatusBadge";
import { getServerSupabase } from "@/lib/supabase-server";

export default async function DashboardHome() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let linkedinAccount: any = null;
  let allPosts: any[] = [];
  let postsThisMonth = 0;
  let totalReach = 0;
  let avgEngagement = 0;
  let publishedCount = 0;

  if (user) {
    const { data: linkedinData } = await supabase
      .from("user_linkedin_accounts")
      .select("profile_name, profile_email, profile_photo_url, linkedin_id, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    linkedinAccount = linkedinData;

    const { data: postsData } = await supabase
      .from("generated_posts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    allPosts = postsData || [];

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    postsThisMonth = allPosts.filter(
      (p) => new Date(p.created_at) >= startOfMonth,
    ).length;

    totalReach = allPosts.reduce((sum, p) => sum + (p.estimated_reach || 0), 0);
    const engagements = allPosts
      .filter((p) => p.engagement_rate)
      .map((p) => p.engagement_rate);
    avgEngagement =
      engagements.length > 0
        ? engagements.reduce((a, b) => a + b, 0) / engagements.length
        : 0;
    publishedCount = allPosts.filter((p) => p.status === "published").length;
  }

  const upcoming = allPosts
    .filter((p) => p.status === "scheduled")
    .slice(0, 3);
  const recent = allPosts.filter((p) => p.status === "published").slice(0, 3);
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
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
                Welcome back.
              </h1>
              <p className="mt-3 text-lg text-white/70">
                {allPosts.length === 0
                  ? "Let's create your first LinkedIn post."
                  : `You have ${upcoming.length} post${upcoming.length === 1 ? "" : "s"} scheduled and ${publishedCount} published.`}
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/content-generator" className="flex-1">
                <Button className="w-full bg-white !text-ink hover:bg-white/90">
                  <Sparkles className="h-4 w-4" />
                  Generate post
                </Button>
              </Link>
              <Link href="/dashboard/calendar">
                <Button variant="ghost" className="border border-white/30 !text-white hover:bg-white/10">
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
          value={postsThisMonth.toString()}
          icon={<Send className="h-5 w-5" />}
        />
        <StatCard
          label="Estimated reach"
          value={totalReach.toLocaleString()}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Avg engagement"
          value={avgEngagement > 0 ? `${avgEngagement.toFixed(1)}%` : "—"}
          icon={<Heart className="h-5 w-5" />}
        />
        <StatCard
          label="Published"
          value={publishedCount.toString()}
          icon={<Users className="h-5 w-5" />}
        />
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
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed text-ink line-clamp-2">
                      {(post.content || "").slice(0, 80)}
                    </p>
                    {post.tone && (
                      <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
                        {post.tone}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={post.status} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <Inbox className="mx-auto h-8 w-8 text-neutral-300" />
              <p className="mt-3 text-sm text-neutral-500">No scheduled posts yet</p>
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
                    {(post.content || "").slice(0, 100)}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {(post.estimated_reach || 0).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <Inbox className="mx-auto h-8 w-8 text-neutral-300" />
              <p className="mt-3 text-sm text-neutral-500">No published posts yet</p>
            </div>
          )}
        </Card>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-8">
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-ink">
            Ready to grow on LinkedIn?
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
            <Link href="/dashboard/analytics">
              <Button variant="secondary">
                <BarChart3 className="h-4 w-4" />
                View analytics
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
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
        </div>
        <div className="rounded-lg p-3 bg-neutral-100 text-neutral-600">
          {icon}
        </div>
      </div>
    </Card>
  );
}
