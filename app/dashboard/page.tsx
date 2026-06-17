import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  Inbox,
  Linkedin,
  MessageCircle,
  RefreshCw,
  Repeat2,
  Send,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Button from "@/components/Common/Button";
import { getServerSupabase } from "@/lib/supabase-server";

export default async function DashboardHome() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let linkedinAccount: any = null;
  let allPosts: any[] = [];
  let publishedCount = 0;
  let totalReach = 0;
  let postsThisMonth = 0;

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
    postsThisMonth = allPosts.filter((p) => new Date(p.created_at) >= startOfMonth).length;
    totalReach = allPosts.reduce((sum, p) => sum + (p.estimated_reach || 0), 0);
    publishedCount = allPosts.filter((p) => p.status === "published").length;
  }

  const upcoming = allPosts.filter((p) => p.status === "scheduled").slice(0, 3);
  const recent = allPosts.filter((p) => p.status === "published").slice(0, 3);
  const isLinkedinConnected = Boolean(linkedinAccount);
  const displayName = linkedinAccount?.profile_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const postIdeas = [
    "Most business owners overlook the simple automation step that halves customer support workload overnight.",
    "I realized that building with AI isn't about technology — it's about understanding your customer's deeper problems.",
    "The biggest mistake companies make when scaling is thinking more technology equals better results.",
  ];

  const topCreators = [
    { name: "Alex Rivera", role: "Founder @ Northwind · 24.1k followers", avatar: "AR", grad: "from-brand to-action" },
    { name: "Maya Chen", role: "Head of Growth · 18.6k followers", avatar: "MC", grad: "from-action to-violet-500" },
    { name: "Sam Park", role: "B2B SaaS founder · 11.2k followers", avatar: "SP", grad: "from-amber-400 to-rose-500" },
  ];

  const engagePosts = [
    { name: "Luke Shalom", time: "4h ago", reactions: 55, snippet: "We found a platform with high buying intent. We're..." },
    { name: "Anthony Carlton", time: "5h ago", reactions: 78, snippet: "I never understood why people get obsessed with..." },
    { name: "Matt Gray", time: "6h ago", reactions: 429, snippet: "7 steps to design the life you want: 1. Prioritize Your..." },
    { name: "Jason Vana", time: "6h ago", reactions: 23, snippet: "I trained AI to ideate and write weekly client email..." },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* ── Top header bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 bg-white px-4 sm:px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            Welcome back, {displayName}.
          </h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {upcoming.length > 0
              ? `${upcoming.length} post${upcoming.length === 1 ? "" : "s"} scheduled this week.`
              : "Let's create your first LinkedIn post."}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {!isLinkedinConnected && (
            <a href="/api/auth/linkedin/authorize">
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0A66C2]/90">
                <Linkedin className="h-3.5 w-3.5" />
                Connect LinkedIn
              </button>
            </a>
          )}
          <Link href="/dashboard/content-generator">
            <button className="inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
              <Sparkles className="h-3.5 w-3.5" />
              Create post
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 gap-px border-b border-neutral-200 bg-neutral-200 lg:grid-cols-4">
        {[
          { label: "Followers", value: isLinkedinConnected ? "—" : "Connect LinkedIn", icon: Users, accent: false },
          { label: "Posts this month", value: postsThisMonth.toString(), icon: Send, accent: false },
          { label: "Estimated reach", value: totalReach > 0 ? totalReach.toLocaleString() : "0", icon: Eye, accent: false },
          { label: "Published", value: publishedCount.toString(), icon: CheckCircle2, accent: true },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 bg-white px-4 py-4 sm:px-6 sm:py-5">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.accent ? "bg-brand/10 text-brand" : "bg-neutral-100 text-neutral-500"}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-neutral-500 truncate">{s.label}</p>
              <p className="mt-0.5 text-xl font-semibold tracking-tight text-ink truncate">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[1fr_340px]">

        {/* LEFT column */}
        <div className="space-y-5">

          {/* Post ideas */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-ink">Post ideas for you</h2>
                <p className="mt-0.5 text-xs text-neutral-500">AI-generated based on your niche</p>
              </div>
              <Link href="/dashboard/content-generator">
                <button className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50">
                  <RefreshCw className="h-3 w-3" /> New ideas
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-px bg-neutral-100 md:grid-cols-3">
              {postIdeas.map((idea, i) => (
                <div key={i} className="flex flex-col justify-between bg-white p-5">
                  <p className="text-sm leading-relaxed text-neutral-700">{idea}</p>
                  <Link href={`/dashboard/content-generator`} className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-brand transition-colors hover:text-action">
                    Generate post <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* High-performing creators */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-ink">High-performing creators</h2>
                <p className="mt-0.5 text-xs text-neutral-500">Repurpose their best content in your voice</p>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50">
                <RefreshCw className="h-3 w-3" /> New creators
              </button>
            </div>
            <div className="grid grid-cols-1 gap-px bg-neutral-100 md:grid-cols-3">
              {topCreators.map((c, i) => (
                <div key={i} className="flex flex-col gap-4 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${c.grad} text-sm font-semibold text-white`}>
                      {c.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-ink">{c.name}</p>
                      <p className="truncate text-[11px] text-neutral-500">{c.role}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/content-generator" className="inline-flex items-center gap-1 text-[13px] font-medium text-brand transition-colors hover:text-action">
                    Repurpose posts <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row: schedule + recent */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Scheduled */}
            <div className="rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-ink">Scheduled posts</h2>
                <Link href="/dashboard/calendar" className="text-[12px] font-medium text-brand hover:text-action">
                  View calendar →
                </Link>
              </div>
              {upcoming.length > 0 ? (
                <ul className="divide-y divide-neutral-100">
                  {upcoming.map((post) => (
                    <li key={post.id} className="flex items-start gap-3 px-5 py-3.5">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] text-ink">{(post.content || "").slice(0, 60)}…</p>
                        {post.scheduled_for && (
                          <p className="mt-0.5 text-[11px] text-neutral-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(post.scheduled_for).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                  </div>
                  <p className="mt-3 text-sm text-neutral-500">No posts scheduled after today.</p>
                  <p className="mt-0.5 text-xs text-neutral-400">Stay ahead of your post planning.</p>
                  <Link href="/dashboard/calendar">
                    <button className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-brand/10 px-3 py-1.5 text-[12px] font-medium text-brand hover:bg-brand/20">
                      <Calendar className="h-3.5 w-3.5" /> Schedule posts <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent posts */}
            <div className="rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-ink">Recent posts</h2>
                <Link href="/dashboard/analytics" className="text-[12px] font-medium text-brand hover:text-action">
                  View analytics →
                </Link>
              </div>
              {recent.length > 0 ? (
                <ul className="divide-y divide-neutral-100">
                  {recent.map((post) => (
                    <li key={post.id} className="px-5 py-3.5">
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-neutral-700">
                        {(post.content || "").slice(0, 80)}…
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{(post.estimated_reach || 0).toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes || 0}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                    <Inbox className="h-5 w-5 text-neutral-400" />
                  </div>
                  <p className="mt-3 text-sm text-neutral-500">No published posts yet.</p>
                  <Link href="/dashboard/content-generator">
                    <button className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-[12px] font-medium text-white hover:bg-neutral-800">
                      <Sparkles className="h-3.5 w-3.5" /> Create your first post
                    </button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-5">

          {/* Engagement Hub */}
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-ink">Your Engagement Hub</h2>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </div>

            {/* Weekly progress */}
            <div className="border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 font-medium text-ink">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10">
                    <TrendingUp className="h-3.5 w-3.5 text-brand" />
                  </div>
                  Weekly progress
                </div>
                <span className="text-[12px] text-neutral-400">0/20 comments sent</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full w-0 rounded-full bg-brand" />
              </div>
            </div>

            {/* Posts to engage */}
            <div className="px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Posts to engage with
              </p>
              <ul className="mt-3 space-y-4">
                {engagePosts.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-action text-[11px] font-semibold text-white">
                      {p.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-ink">{p.name}</p>
                        <button className="flex-shrink-0 rounded-md border border-neutral-200 p-1 text-neutral-400 transition-colors hover:border-brand hover:text-brand">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-neutral-500">{p.snippet}</p>
                      <p className="mt-1 text-[11px] text-neutral-400">
                        <Heart className="mr-0.5 inline h-3 w-3" />{p.reactions} · {p.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Replies needed */}
            <div className="border-t border-neutral-100 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                Replies needed
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[13px] text-neutral-400">No pending replies</p>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-brand/10 px-3 py-1.5 text-[12px] font-medium text-brand transition-colors hover:bg-brand/20">
                  <Send className="h-3 w-3" /> Post now
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats card */}
          <div className="rounded-xl border border-neutral-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-ink">This week at a glance</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: "Posts created", value: postsThisMonth, icon: Sparkles },
                { label: "Scheduled", value: upcoming.length, icon: Calendar },
                { label: "Published", value: publishedCount, icon: CheckCircle2 },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-neutral-600">
                    <s.icon className="h-3.5 w-3.5 text-neutral-400" />
                    {s.label}
                  </div>
                  <span className="text-[13px] font-semibold text-ink">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-neutral-100 pt-4">
              <Link href="/dashboard/analytics">
                <button className="w-full rounded-md border border-neutral-200 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50">
                  View full analytics
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
