"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Inbox,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/Common/Button";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type PostStatus = "scheduled" | "publishing" | "published" | "failed";

interface CalendarPost {
  id: string;
  text: string;
  status: PostStatus;
  scheduledFor: string; // ISO string
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function startOfMonth(y: number, m: number) {
  return new Date(y, m, 1);
}
function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_COLOR: Record<PostStatus, string> = {
  scheduled: "bg-blue-500",
  publishing: "bg-amber-400",
  published: "bg-emerald-500",
  failed: "bg-red-400",
};
const STATUS_LABEL: Record<PostStatus, string> = {
  scheduled: "Scheduled",
  publishing: "Publishing",
  published: "Published",
  failed: "Failed",
};
const STATUS_PILL: Record<PostStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700 ring-blue-100",
  publishing: "bg-amber-50 text-amber-700 ring-amber-100",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  failed: "bg-red-50 text-red-700 ring-red-100",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [filter, setFilter] = useState<PostStatus | "all">("all");

  /* fetch from both tables */
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      // 1. generated_posts that have a scheduled_for date
      const { data: gp } = await supabase
        .from("generated_posts")
        .select("id, content, status, scheduled_for")
        .eq("user_id", user.id)
        .not("scheduled_for", "is", null)
        .order("scheduled_for", { ascending: true });

      // 2. scheduled_posts_v2 (all posts queued via the publish API)
      const { data: sp } = await supabase
        .from("scheduled_posts_v2")
        .select("id, text, status, scheduled_for")
        .eq("user_id", user.id)
        .order("scheduled_for", { ascending: true });

      const fromGP: CalendarPost[] = (gp ?? []).map((p) => ({
        id: `gp-${p.id}`,
        text: p.content,
        status: p.status as PostStatus,
        scheduledFor: p.scheduled_for!,
      }));

      const fromSP: CalendarPost[] = (sp ?? []).map((p) => ({
        id: `sp-${p.id}`,
        text: p.text,
        status: p.status as PostStatus,
        scheduledFor: p.scheduled_for,
      }));

      // merge, deduplicate by scheduledFor+text prefix in case both tables have the same post
      const seen = new Set<string>();
      const merged: CalendarPost[] = [];
      for (const p of [...fromSP, ...fromGP]) {
        const key = `${p.scheduledFor}-${p.text.slice(0, 40)}`;
        if (!seen.has(key)) { seen.add(key); merged.push(p); }
      }
      merged.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));

      setPosts(merged);
      setLoading(false);
    });
  }, []);

  /* calendar math */
  const firstDOW = startOfMonth(year, month).getDay(); // 0=Sun
  const totalDays = daysInMonth(year, month);
  const totalCells = Math.ceil((firstDOW + totalDays) / 7) * 7;

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  function postsForDay(d: Date) {
    return posts.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      return isSameDay(new Date(p.scheduledFor), d);
    });
  }

  const selectedPosts = selectedDay ? postsForDay(selectedDay) : [];

  /* stats */
  const stats = {
    scheduled: posts.filter((p) => p.status === "scheduled" || p.status === "publishing").length,
    published: posts.filter((p) => p.status === "published").length,
    failed: posts.filter((p) => p.status === "failed").length,
    total: posts.length,
  };

  const monthLabel = new Date(year, month).toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">
            Content Calendar
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            All your scheduled and published LinkedIn posts.
          </p>
        </div>
        <Link href="/dashboard/content-generator">
          <Button>
            <Sparkles className="h-4 w-4" />
            Generate post
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Scheduled" value={stats.scheduled} color="text-blue-600" />
        <StatBox label="Published" value={stats.published} color="text-emerald-600" />
        <StatBox label="Failed" value={stats.failed} color="text-red-500" />
        <StatBox label="Total" value={stats.total} color="text-ink" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        {/* ── Calendar grid ── */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          {/* month nav */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50"
              >
                <ChevronLeft className="h-4 w-4 text-neutral-600" />
              </button>
              <h2 className="text-sm font-semibold text-ink">{monthLabel}</h2>
              <button
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50"
              >
                <ChevronRight className="h-4 w-4 text-neutral-600" />
              </button>
            </div>

            {/* filter pills */}
            <div className="hidden items-center gap-1 sm:flex">
              {(["all", "scheduled", "published", "failed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-medium transition-colors capitalize",
                    filter === f
                      ? "bg-ink text-white"
                      : "text-neutral-500 hover:bg-neutral-100",
                  )}
                >
                  {f === "all" ? "All" : STATUS_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          {/* weekday headers */}
          <div className="grid grid-cols-7 border-b border-neutral-100">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400"
              >
                {d}
              </div>
            ))}
          </div>

          {/* day cells */}
          {loading ? (
            <div className="py-20 text-center text-sm text-neutral-400">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - firstDOW + 1;
                const isCurrentMonth = dayNum >= 1 && dayNum <= totalDays;
                const cellDate = new Date(year, month, dayNum);
                const isToday = isCurrentMonth && isSameDay(cellDate, today);
                const isPast = isCurrentMonth && !isToday && cellDate < today;
                const isSelected =
                  isCurrentMonth &&
                  selectedDay != null &&
                  isSameDay(cellDate, selectedDay);
                const dayPosts = isCurrentMonth ? postsForDay(cellDate) : [];
                const isLastRow = i >= totalCells - 7;

                return (
                  <div
                    key={i}
                    onClick={() =>
                      isCurrentMonth && setSelectedDay(cellDate)
                    }
                    className={cn(
                      "relative min-h-[90px] border-b border-r border-neutral-100 p-2 transition-colors",
                      isLastRow && "border-b-0",
                      (i + 1) % 7 === 0 && "border-r-0",
                      !isCurrentMonth && "bg-neutral-50/40",
                      isCurrentMonth && isPast && "bg-neutral-50/70 cursor-pointer hover:bg-neutral-100/60",
                      isCurrentMonth && !isPast && "cursor-pointer hover:bg-neutral-50",
                      isSelected && "bg-blue-50/60",
                    )}
                  >
                    {/* day number */}
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium",
                        isToday
                          ? "bg-ink text-white"
                          : isPast
                            ? "text-neutral-300"
                            : isCurrentMonth
                              ? "text-ink"
                              : "text-neutral-200",
                      )}
                    >
                      {isCurrentMonth ? dayNum : ""}
                    </span>

                    {/* post chips */}
                    <div className="mt-1 space-y-0.5">
                      {dayPosts.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className={cn(
                            "flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium truncate",
                            isPast
                              ? "bg-neutral-100 text-neutral-400"
                              : "bg-neutral-100 text-neutral-700",
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 flex-shrink-0 rounded-full",
                              STATUS_COLOR[p.status],
                            )}
                          />
                          <span className="truncate">
                            {fmtTime(p.scheduledFor)} · {p.text.slice(0, 22)}
                          </span>
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <p className="pl-1 text-[10px] text-neutral-400">
                          +{dayPosts.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Day panel ── */}
        <div className="rounded-xl border border-neutral-200 bg-white xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
          {selectedDay ? (
            <>
              <div className="border-b border-neutral-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    {isSameDay(selectedDay, today)
                      ? "Today"
                      : selectedDay < today
                        ? "Past"
                        : "Upcoming"}
                  </p>
                  {isSameDay(selectedDay, today) && (
                    <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      Today
                    </span>
                  )}
                </div>
                <h3 className="mt-0.5 text-sm font-semibold text-ink">
                  {fmtDate(selectedDay.toISOString())}
                </h3>
              </div>

              {selectedPosts.length === 0 ? (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                  <Inbox className="h-8 w-8 text-neutral-300" />
                  <p className="mt-3 text-sm text-neutral-500">
                    No posts scheduled for this day.
                  </p>
                  <Link href="/dashboard/content-generator">
                    <Button size="sm" className="mt-4">
                      <Sparkles className="h-3.5 w-3.5" />
                      Create post
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {selectedPosts.map((p) => (
                    <li key={p.id} className="px-5 py-4">
                      {/* time + status */}
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          {fmtTime(p.scheduledFor)}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                            STATUS_PILL[p.status],
                          )}
                        >
                          {STATUS_LABEL[p.status]}
                        </span>
                      </div>
                      {/* post text */}
                      <p className="line-clamp-4 text-[13px] leading-relaxed text-ink">
                        {p.text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                <Send className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-ink">
                Pick a day
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-neutral-400">
                Click any date to see posts scheduled for that day.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── StatBox ────────────────────────────────────────────────────────────── */

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>
      <p className={cn("mt-1 text-2xl font-bold tracking-tight", color)}>
        {value}
      </p>
    </div>
  );
}
