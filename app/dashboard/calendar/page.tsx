"use client";

import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Common/Button";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type PostStatus = "scheduled" | "publishing" | "published" | "failed";

interface CalendarPost {
  id: string;
  text: string;
  status: PostStatus;
  scheduledFor: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

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
function isPastDay(d: Date, today: Date) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return dd < t;
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDayFull(d: Date) {
  return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function toLocalIsoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/** Next round hour from now, minimum 1 h ahead */
function defaultTime() {
  const d = new Date();
  d.setHours(d.getHours() + 1, 0, 0, 0);
  return `${String(d.getHours()).padStart(2, "0")}:00`;
}

const STATUS_DOT: Record<PostStatus, string> = {
  scheduled: "bg-blue-500",
  publishing: "bg-amber-400",
  published: "bg-emerald-500",
  failed: "bg-red-400",
};
const STATUS_PILL: Record<PostStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700 ring-blue-100",
  publishing: "bg-amber-50 text-amber-700 ring-amber-100",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  failed: "bg-red-50 text-red-700 ring-red-100",
};
const STATUS_LABEL: Record<PostStatus, string> = {
  scheduled: "Scheduled",
  publishing: "Publishing…",
  published: "Published",
  failed: "Failed",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(true);

  /* selected day panel */
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  /* quick-schedule state */
  const [showCompose, setShowCompose] = useState(false);
  const [qText, setQText] = useState("");
  const [qTime, setQTime] = useState(defaultTime());
  const [qBusy, setQBusy] = useState(false);
  const [qNotice, setQNotice] = useState<{ ok: boolean; msg: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* fetch from both tables */
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      const [{ data: gp }, { data: sp }] = await Promise.all([
        supabase
          .from("generated_posts")
          .select("id, content, status, scheduled_for")
          .eq("user_id", user.id)
          .not("scheduled_for", "is", null)
          .order("scheduled_for", { ascending: true }),
        supabase
          .from("scheduled_posts_v2")
          .select("id, text, status, scheduled_for")
          .eq("user_id", user.id)
          .order("scheduled_for", { ascending: true }),
      ]);

      const fromGP: CalendarPost[] = (gp ?? []).map((p) => ({
        id: `gp-${p.id}`, text: p.content, status: p.status as PostStatus,
        scheduledFor: p.scheduled_for!,
      }));
      const fromSP: CalendarPost[] = (sp ?? []).map((p) => ({
        id: `sp-${p.id}`, text: p.text, status: p.status as PostStatus,
        scheduledFor: p.scheduled_for,
      }));

      const seen = new Set<string>();
      const merged: CalendarPost[] = [];
      for (const p of [...fromSP, ...fromGP]) {
        const key = `${p.scheduledFor.slice(0, 16)}-${p.text.slice(0, 40)}`;
        if (!seen.has(key)) { seen.add(key); merged.push(p); }
      }
      merged.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
      setPosts(merged);
      setLoading(false);
    });
  }, []);

  /* calendar math */
  const firstDOW = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const totalCells = Math.ceil((firstDOW + totalDays) / 7) * 7;

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null); setShowCompose(false);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null); setShowCompose(false);
  }

  function postsForDay(d: Date) {
    return posts.filter((p) => isSameDay(new Date(p.scheduledFor), d));
  }

  function selectDay(d: Date) {
    setSelectedDay(d);
    setShowCompose(false);
    setQText(""); setQNotice(null);
    setQTime(defaultTime());
  }

  /* quick schedule */
  async function handleQuickSchedule() {
    if (!selectedDay || !qText.trim()) return;
    const dateStr = toLocalIsoDate(selectedDay);
    const scheduledFor = new Date(`${dateStr}T${qTime}`).toISOString();

    if (new Date(scheduledFor) <= new Date()) {
      setQNotice({ ok: false, msg: "Please pick a time in the future." });
      return;
    }

    setQBusy(true); setQNotice(null);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: qText.trim(), scheduledFor }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setQNotice({ ok: false, msg: data.error ?? "Could not schedule. Try again." });
        return;
      }
      // optimistically add to local state
      const newPost: CalendarPost = {
        id: `opt-${Date.now()}`, text: qText.trim(),
        status: "scheduled", scheduledFor,
      };
      setPosts((prev) => [...prev, newPost].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)));
      setQText(""); setShowCompose(false);
      setQNotice({ ok: true, msg: `Scheduled for ${fmtTime(scheduledFor)}` });
    } catch {
      setQNotice({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setQBusy(false);
    }
  }

  /* stats */
  const stats = {
    scheduled: posts.filter((p) => p.status === "scheduled" || p.status === "publishing").length,
    published: posts.filter((p) => p.status === "published").length,
    failed: posts.filter((p) => p.status === "failed").length,
    total: posts.length,
  };

  const monthLabel = new Date(year, month).toLocaleDateString([], { month: "long", year: "numeric" });
  const selectedPosts = selectedDay ? postsForDay(selectedDay) : [];
  const selectedIsPast = selectedDay ? isPastDay(selectedDay, today) : false;
  const selectedIsToday = selectedDay ? isSameDay(selectedDay, today) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">Content Calendar</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Click any date to schedule or view posts.
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
        <StatBox label="Total queued" value={stats.total} color="text-ink" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        {/* ── Calendar grid ── */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {/* Month nav */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50">
                <ChevronLeft className="h-4 w-4 text-neutral-500" />
              </button>
              <h2 className="min-w-[130px] text-center text-sm font-semibold text-ink">{monthLabel}</h2>
              <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50">
                <ChevronRight className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            <p className="hidden text-[11px] text-neutral-400 sm:block">
              Click a date to schedule
            </p>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/50">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          {loading ? (
            <div className="py-24 text-center text-sm text-neutral-400">Loading…</div>
          ) : (
            <div className="grid grid-cols-7">
              {Array.from({ length: totalCells }).map((_, i) => {
                const dayNum = i - firstDOW + 1;
                const inMonth = dayNum >= 1 && dayNum <= totalDays;
                const cellDate = new Date(year, month, dayNum);
                const isToday = inMonth && isSameDay(cellDate, today);
                const isPast = inMonth && !isToday && isPastDay(cellDate, today);
                const isSelected = inMonth && !!selectedDay && isSameDay(cellDate, selectedDay);
                const dayPosts = inMonth ? postsForDay(cellDate) : [];
                const isLastRow = i >= totalCells - 7;

                return (
                  <div
                    key={i}
                    onClick={() => inMonth && selectDay(cellDate)}
                    className={cn(
                      "group relative min-h-[88px] border-b border-r border-neutral-100 p-2 transition-colors",
                      isLastRow && "border-b-0",
                      (i + 1) % 7 === 0 && "border-r-0",
                      !inMonth && "bg-neutral-50/30",
                      inMonth && isPast && "cursor-pointer bg-neutral-50/60 hover:bg-neutral-100/50",
                      inMonth && !isPast && "cursor-pointer hover:bg-blue-50/30",
                      isSelected && "bg-blue-50/60 ring-1 ring-inset ring-blue-200",
                    )}
                  >
                    {/* Day number */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium",
                          isToday ? "bg-ink text-white" : isPast ? "text-neutral-300" : inMonth ? "text-ink" : "text-neutral-200",
                        )}
                      >
                        {inMonth ? dayNum : ""}
                      </span>
                      {/* "+" hint on hover for future days */}
                      {inMonth && !isPast && (
                        <span className="hidden text-[10px] font-medium text-blue-400 group-hover:block">
                          + Add
                        </span>
                      )}
                    </div>

                    {/* Time chips */}
                    <div className="mt-1.5 space-y-0.5">
                      {dayPosts.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className={cn(
                            "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                            isPast
                              ? "bg-neutral-100 text-neutral-400"
                              : "bg-white text-neutral-600 shadow-sm ring-1 ring-neutral-200",
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", STATUS_DOT[p.status])} />
                          {fmtTime(p.scheduledFor)}
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <p className="pl-1 text-[10px] text-neutral-400">+{dayPosts.length - 3} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="flex flex-col rounded-xl border border-neutral-200 bg-white xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
          {selectedDay ? (
            <>
              {/* Panel header */}
              <div className="flex items-start justify-between border-b border-neutral-100 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.16em]",
                      selectedIsToday ? "text-ink" : selectedIsPast ? "text-neutral-400" : "text-blue-600",
                    )}>
                      {selectedIsToday ? "Today" : selectedIsPast ? "Past" : "Upcoming"}
                    </span>
                    {selectedIsToday && (
                      <span className="rounded-full bg-ink px-2 py-px text-[9px] font-bold uppercase tracking-wider text-white">Today</span>
                    )}
                  </div>
                  <h3 className="mt-0.5 text-sm font-semibold text-ink">{fmtDayFull(selectedDay)}</h3>
                </div>
                <button
                  onClick={() => { setSelectedDay(null); setShowCompose(false); }}
                  className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Success notice */}
              {qNotice?.ok && (
                <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700 ring-1 ring-emerald-100">
                  <CalendarCheck className="h-3.5 w-3.5 flex-shrink-0" />
                  {qNotice.msg} — post scheduled!
                </div>
              )}

              {/* Existing posts */}
              {selectedPosts.length > 0 && (
                <div className="px-5 pt-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    {selectedPosts.length} post{selectedPosts.length > 1 ? "s" : ""} this day
                  </p>
                  <ul className="space-y-2">
                    {selectedPosts.map((p) => (
                      <li key={p.id} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-600">
                            <Clock className="h-3 w-3 text-neutral-400" />
                            {fmtTime(p.scheduledFor)}
                          </span>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-px text-[10px] font-semibold ring-1 ring-inset",
                            STATUS_PILL[p.status],
                          )}>
                            {STATUS_LABEL[p.status]}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-[12px] leading-relaxed text-ink">{p.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Quick-schedule composer ── */}
              <div className="flex-1 px-5 pb-5 pt-4">
                {!selectedIsPast ? (
                  <>
                    {!showCompose ? (
                      <button
                        onClick={() => {
                          setShowCompose(true);
                          setQNotice(null);
                          setTimeout(() => textareaRef.current?.focus(), 50);
                        }}
                        className="w-full rounded-lg border-2 border-dashed border-neutral-200 py-5 text-[13px] font-medium text-neutral-400 transition-colors hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500"
                      >
                        + Schedule a post for this day
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                          New post
                        </p>

                        {/* Error notice */}
                        {qNotice && !qNotice.ok && (
                          <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600 ring-1 ring-red-100">
                            {qNotice.msg}
                          </p>
                        )}

                        {/* Textarea */}
                        <textarea
                          ref={textareaRef}
                          value={qText}
                          onChange={(e) => setQText(e.target.value)}
                          placeholder="Write your LinkedIn post here…"
                          rows={6}
                          className="w-full resize-none rounded-lg border border-neutral-200 bg-white p-3 text-[13px] leading-relaxed text-ink placeholder:text-neutral-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />

                        {/* Char count */}
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[11px] font-medium tabular-nums",
                            qText.length > 3000 ? "text-red-500" : "text-neutral-400",
                          )}>
                            {qText.length} / 3000
                          </span>
                        </div>

                        {/* Time picker */}
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                            Time
                          </label>
                          <div className="relative">
                            <Clock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                            <input
                              type="time"
                              value={qTime}
                              onChange={(e) => setQTime(e.target.value)}
                              className="h-9 w-full rounded-md border border-neutral-200 bg-white pl-8 pr-3 text-[13px] text-ink focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setShowCompose(false); setQText(""); setQNotice(null); }}
                            className="flex-1 rounded-md border border-neutral-200 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleQuickSchedule}
                            disabled={qBusy || !qText.trim() || qText.length > 3000}
                            className="flex-1 rounded-md bg-ink py-2 text-[12px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                          >
                            {qBusy ? "Scheduling…" : "Schedule"}
                          </button>
                        </div>

                        {/* Generate with AI link */}
                        <Link
                          href={`/dashboard/content-generator?scheduleDate=${toLocalIsoDate(selectedDay)}`}
                          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-neutral-200 py-2 text-[12px] font-medium text-neutral-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Generate with AI instead
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  /* Past day — read-only */
                  selectedPosts.length === 0 && (
                    <p className="mt-2 text-center text-[12px] text-neutral-400">
                      No posts were scheduled for this day.
                    </p>
                  )
                )}
              </div>
            </>
          ) : (
            /* No day selected */
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                <CalendarCheck className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">Pick a day</p>
              <p className="mt-1 text-[12px] leading-relaxed text-neutral-400">
                Click any date to view scheduled posts or schedule a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── StatBox ────────────────────────────────────────────────────────────── */

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold tracking-tight", color)}>{value}</p>
    </div>
  );
}
