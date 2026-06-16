import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import StatusBadge from "@/components/Common/StatusBadge";
import EngagementMetrics from "@/components/Analytics/EngagementMetrics";
import PerformanceChart from "@/components/Analytics/PerformanceChart";
import { DASHBOARD_METRICS, POSTS, TREND_DATA } from "@/lib/mock";
import { formatDate, formatTime, truncate } from "@/lib/utils";

const TRENDING = [
  { topic: "AI in the workplace", delta: "+312%" },
  { topic: "Remote team culture", delta: "+184%" },
  { topic: "Personal branding", delta: "+126%" },
  { topic: "Founder lessons", delta: "+88%" },
  { topic: "Hiring & retention", delta: "+64%" },
];

export default function DashboardHome() {
  const upcoming = POSTS.filter((p) => p.status === "scheduled").slice(0, 4);
  const recent = POSTS.filter((p) => p.status === "published").slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Hero strip */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-ink p-7 text-white sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-32 h-56 w-56 rounded-full bg-action/30 blur-3xl"
        />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90">
              <Flame className="h-3 w-3 text-orange-300" />
              On a 7-day streak
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Welcome back, John.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Reach is up <span className="font-semibold text-white">+24%</span>{" "}
              this month. You have <span className="font-semibold text-white">3 posts</span>{" "}
              queued for this week.
            </p>
          </div>
          <div className="flex w-full flex-shrink-0 items-center gap-2 sm:w-auto">
            <Link href="/dashboard/calendar" className="flex-1 sm:flex-none">
              <Button
                variant="ghost"
                className="w-full text-white hover:bg-white/10"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </Link>
            <Link href="/dashboard/content-generator" className="flex-1 sm:flex-none">
              <Button className="w-full bg-white text-ink hover:bg-white/90">
                <Sparkles className="h-4 w-4" />
                New post
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <SectionLabel>This month</SectionLabel>
            <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
              Performance overview
            </h3>
          </div>
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 transition-colors hover:text-ink"
          >
            View analytics
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <EngagementMetrics metrics={DASHBOARD_METRICS} />
      </section>

      {/* Chart + Trending */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <SectionLabel>Last 7 days</SectionLabel>
              <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
                Reach trend
              </h3>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-neutral-100 p-0.5 text-xs font-medium">
              <button className="rounded bg-white px-2.5 py-1 text-ink shadow-sm">
                7d
              </button>
              <button className="px-2.5 py-1 text-neutral-500">30d</button>
              <button className="px-2.5 py-1 text-neutral-500">90d</button>
            </div>
          </div>
          <PerformanceChart data={TREND_DATA} />
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <SectionLabel>Trending in your niche</SectionLabel>
              <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
                Topics
              </h3>
            </div>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <ul className="-mx-2 space-y-0.5">
            {TRENDING.map((t, i) => (
              <li key={t.topic}>
                <button className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-neutral-50">
                  <span className="flex h-5 w-5 items-center justify-center rounded text-[11px] font-mono font-semibold text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm text-ink">{t.topic}</span>
                  <span className="text-[11px] font-semibold text-success">
                    {t.delta}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/content-generator"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-neutral-600 transition-colors hover:text-ink"
          >
            Draft a post about these
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>
      </section>

      {/* Upcoming + Recent */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <div>
              <SectionLabel>Queue</SectionLabel>
              <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
                Upcoming posts
              </h3>
            </div>
            <Link
              href="/dashboard/calendar"
              className="text-xs font-medium text-neutral-600 transition-colors hover:text-ink"
            >
              View calendar →
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {upcoming.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-neutral-50/50"
              >
                <div className="flex w-12 flex-shrink-0 flex-col items-center rounded-lg border border-neutral-200 bg-white py-1.5 text-center">
                  <Clock className="h-3 w-3 text-neutral-400" />
                  <span className="mt-0.5 text-[10px] font-medium text-neutral-600">
                    {p.scheduledFor && formatTime(p.scheduledFor)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-ink">
                    {truncate(p.text, 84)}
                  </p>
                  <p className="mt-1.5 text-[11px] text-neutral-500">
                    {p.scheduledFor && formatDate(p.scheduledFor)} · {p.tone}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <div>
              <SectionLabel>Activity</SectionLabel>
              <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
                Recent posts
              </h3>
            </div>
            <Link
              href="/dashboard/content-library"
              className="text-xs font-medium text-neutral-600 transition-colors hover:text-ink"
            >
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {recent.map((p) => (
              <li
                key={p.id}
                className="px-6 py-4 transition-colors hover:bg-neutral-50/50"
              >
                <p className="text-sm leading-relaxed text-ink">
                  {truncate(p.text, 96)}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                    <span>
                      <span className="font-semibold text-ink">
                        {p.stats?.impressions.toLocaleString()}
                      </span>{" "}
                      impressions
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span>
                      <span className="font-semibold text-success">
                        {p.stats?.engagementRate}%
                      </span>{" "}
                      engagement
                    </span>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
      {children}
    </span>
  );
}
