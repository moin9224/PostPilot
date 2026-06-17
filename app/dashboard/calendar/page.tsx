"use client";

import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
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
function fmtScheduleLabel(d: Date, time: string) {
  const [h, min] = time.split(":");
  const dt = new Date(d);
  dt.setHours(Number(h), Number(min));
  return dt.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" }) +
    ", " + dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function toLocalIsoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function defaultTime(d: Date) {
  const now = new Date();
  if (isSameDay(d, now)) {
    // today: next full hour + 1
    const h = now.getHours() + 2;
    return `${String(Math.min(h, 23)).padStart(2, "0")}:00`;
  }
  return "09:00";
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

/* ─── Composer Modal ─────────────────────────────────────────────────────── */

interface ComposerProps {
  day: Date;
  existingPosts: CalendarPost[];
  onClose: () => void;
  onScheduled: (post: CalendarPost) => void;
}

function ComposerModal({ day, existingPosts, onClose, onScheduled }: ComposerProps) {
  const [postText, setPostText] = useState("");
  const [time, setTime] = useState(() => defaultTime(day));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // AI assist panel
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isToday = isSameDay(day, new Date());

  async function handleAiGenerate() {
    if (!aiPrompt.trim() || aiLoading) return;
    const prompt = aiPrompt.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setAiPrompt("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: prompt, tone: "professional", hook: "question" }),
      });
      const data = await res.json().catch(() => ({}));
      const generated = data.posts?.[0]?.content ?? data.content ?? data.text ?? "";
      if (generated) {
        setAiMessages((prev) => [...prev, { role: "ai", text: generated }]);
      } else {
        setAiMessages((prev) => [...prev, { role: "ai", text: "Could not generate. Try again." }]);
      }
    } catch {
      setAiMessages((prev) => [...prev, { role: "ai", text: "Network error. Please try again." }]);
    } finally {
      setAiLoading(false);
    }
  }

  function useAiText(text: string) {
    setPostText(text);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function applyTransform(label: string) {
    if (!postText.trim()) return;
    const transforms: Record<string, string> = {
      Shorter: "Make this LinkedIn post shorter while keeping the key message:",
      Longer: "Make this LinkedIn post longer with more detail and examples:",
      Bolder: "Make this LinkedIn post bolder and more assertive in tone:",
      "More casual": "Rewrite this LinkedIn post in a more casual, conversational tone:",
      "More formal": "Rewrite this LinkedIn post in a more formal, professional tone:",
    };
    const prefix = transforms[label] ?? `${label}:`;
    const fakePrompt = `${prefix}\n\n${postText}`;
    setAiMessages((prev) => [...prev, { role: "user", text: label }]);
    setAiLoading(true);
    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: fakePrompt, tone: "professional", hook: "question" }),
    })
      .then((r) => r.json())
      .then((data) => {
        const generated = data.posts?.[0]?.content ?? data.content ?? data.text ?? "";
        if (generated) setAiMessages((prev) => [...prev, { role: "ai", text: generated }]);
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }

  async function handleSchedule() {
    if (!postText.trim()) { setError("Please write your post content."); return; }
    if (postText.length > 3000) { setError("Post exceeds 3000 characters."); return; }
    const dateStr = toLocalIsoDate(day);
    const scheduledFor = new Date(`${dateStr}T${time}`).toISOString();
    if (new Date(scheduledFor) <= new Date()) {
      setError("Please pick a time in the future.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postText.trim(), scheduledFor }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error ?? "Could not schedule. Try again."); return; }
      const newPost: CalendarPost = {
        id: `opt-${Date.now()}`,
        text: postText.trim(),
        status: "scheduled",
        scheduledFor,
      };
      onScheduled(newPost);
      setSuccess(`Scheduled for ${fmtScheduleLabel(day, time)}`);
      setPostText("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">

        {/* ── Left: AI Assist ── */}
        <div className="flex w-[340px] flex-shrink-0 flex-col border-r border-neutral-200">
          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-neutral-200 px-4">
            <span className="border-b-2 border-ink px-3 py-3 text-[13px] font-semibold text-ink">
              AI Assist
            </span>
            <span className="px-3 py-3 text-[13px] text-neutral-400">Drafts</span>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 mb-3">
                  <Sparkles className="h-5 w-5 text-violet-500" />
                </div>
                <p className="text-[13px] font-semibold text-ink">Ask AI to write your post</p>
                <p className="mt-1 text-[12px] leading-relaxed text-neutral-400">
                  Type a topic below and AI will generate LinkedIn content for you.
                </p>
              </div>
            )}
            {aiMessages.map((msg, i) => (
              <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "ai" && (
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-blue-100 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-[12px] leading-relaxed",
                  msg.role === "user"
                    ? "bg-ink text-white"
                    : "bg-neutral-100 text-ink",
                )}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.role === "ai" && (
                    <button
                      onClick={() => useAiText(msg.text)}
                      className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Use this →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-blue-100">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
                </div>
                <div className="rounded-xl bg-neutral-100 px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Make it… transforms */}
          {postText.trim() && (
            <div className="border-t border-neutral-100 px-4 pt-3 pb-2">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Make it…</p>
              <div className="flex flex-wrap gap-1.5">
                {["Shorter", "Longer", "Bolder", "More casual", "More formal"].map((t) => (
                  <button
                    key={t}
                    onClick={() => applyTransform(t)}
                    disabled={aiLoading}
                    className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-violet-600 transition-colors hover:border-violet-300 hover:bg-violet-50 disabled:opacity-50"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI prompt input */}
          <div className="border-t border-neutral-200 p-3">
            <div className="flex gap-2 items-end">
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiGenerate(); } }}
                placeholder="Select an action or start typing anything…"
                className="flex-1 resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-2.5 text-[12px] leading-relaxed text-ink placeholder:text-neutral-400 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
              <button
                onClick={handleAiGenerate}
                disabled={!aiPrompt.trim() || aiLoading}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Post Editor ── */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {isToday ? "Today" : "Upcoming"}
              </p>
              <h2 className="text-[15px] font-semibold text-ink">{fmtDayFull(day)}</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Edit / Preview tabs */}
              <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                <span className="rounded-md bg-white px-3 py-1 text-[12px] font-semibold text-ink shadow-sm">Edit</span>
                <span className="px-3 py-1 text-[12px] text-neutral-400">Preview</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Existing posts for this day */}
          {existingPosts.length > 0 && (
            <div className="border-b border-neutral-100 px-5 py-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {existingPosts.length} post{existingPosts.length > 1 ? "s" : ""} already scheduled
              </p>
              <div className="flex flex-wrap gap-2">
                {existingPosts.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1">
                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[p.status])} />
                    <span className="text-[11px] font-medium text-neutral-600">{fmtTime(p.scheduledFor)}</span>
                    <span className={cn("rounded-full px-1.5 py-px text-[10px] font-semibold ring-1 ring-inset", STATUS_PILL[p.status])}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700 ring-1 ring-emerald-100">
              <CalendarCheck className="h-4 w-4 flex-shrink-0" />
              <span><span className="font-semibold">Post scheduled!</span> {success}</span>
            </div>
          )}

          {/* Text area */}
          <div className="flex-1 overflow-y-auto px-5 pt-4">
            <textarea
              ref={textareaRef}
              value={postText}
              onChange={(e) => { setPostText(e.target.value); setError(""); }}
              placeholder="Write your LinkedIn post here…"
              className="h-full min-h-[220px] w-full resize-none rounded-xl border border-neutral-200 bg-white p-4 text-[14px] leading-relaxed text-ink placeholder:text-neutral-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mx-5 mt-2 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600 ring-1 ring-red-100">
              {error}
            </p>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-3.5 gap-4">
            {/* Char count + time picker */}
            <div className="flex items-center gap-4">
              <span className={cn(
                "text-[12px] font-medium tabular-nums",
                postText.length > 3000 ? "text-red-500" : "text-neutral-400",
              )}>
                {postText.length}/3000
              </span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => { setTime(e.target.value); setError(""); }}
                  className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-[12px] text-ink focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <Link
                href={`/dashboard/content-generator?scheduleDate=${toLocalIsoDate(day)}`}
                className="hidden items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 sm:flex"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate with AI
              </Link>
              <button
                onClick={handleSchedule}
                disabled={busy || !postText.trim() || postText.length > 3000}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <CalendarCheck className="h-4 w-4" />
                Schedule Post
                <span className="hidden text-blue-200 sm:inline">
                  · {fmtScheduleLabel(day, time)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerDay, setComposerDay] = useState<Date | null>(null);

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
    setComposerDay(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setComposerDay(null);
  }

  function postsForDay(d: Date) {
    return posts.filter((p) => isSameDay(new Date(p.scheduledFor), d));
  }

  function handleDayClick(d: Date) {
    if (isPastDay(d, today)) return; // past = unclickable
    setComposerDay(d);
  }

  function handleScheduled(newPost: CalendarPost) {
    setPosts((prev) =>
      [...prev, newPost].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
    );
  }

  const stats = {
    scheduled: posts.filter((p) => p.status === "scheduled" || p.status === "publishing").length,
    published: posts.filter((p) => p.status === "published").length,
    failed: posts.filter((p) => p.status === "failed").length,
    total: posts.length,
  };

  const monthLabel = new Date(year, month).toLocaleDateString([], { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Composer Modal */}
      {composerDay && (
        <ComposerModal
          day={composerDay}
          existingPosts={postsForDay(composerDay)}
          onClose={() => setComposerDay(null)}
          onScheduled={handleScheduled}
        />
      )}

      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">Content Calendar</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Click any upcoming date to schedule a post.
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

      {/* Calendar — full width */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {/* Month nav */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <ChevronLeft className="h-4 w-4 text-neutral-500" />
            </button>
            <h2 className="min-w-[140px] text-center text-sm font-semibold text-ink">{monthLabel}</h2>
            <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <ChevronRight className="h-4 w-4 text-neutral-500" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              <LegendDot color="bg-neutral-200" label="Past (view only)" />
              <LegendDot color="bg-blue-500" label="Scheduled" />
              <LegendDot color="bg-emerald-500" label="Published" />
            </div>
            <p className="hidden text-[11px] text-neutral-400 sm:block">
              Click today or future dates to schedule
            </p>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/50">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
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
              const isClickable = inMonth && !isPast;
              const isLastRow = i >= totalCells - 7;
              const dayPosts = inMonth ? postsForDay(cellDate) : [];

              return (
                <div
                  key={i}
                  onClick={() => isClickable && handleDayClick(cellDate)}
                  className={cn(
                    "group relative min-h-[100px] border-b border-r border-neutral-100 p-2 transition-colors",
                    isLastRow && "border-b-0",
                    (i + 1) % 7 === 0 && "border-r-0",
                    !inMonth && "bg-neutral-50/30",
                    isPast && "bg-neutral-50/40 cursor-default",
                    isClickable && "cursor-pointer hover:bg-blue-50/40",
                  )}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium transition-colors",
                        isToday
                          ? "bg-ink text-white"
                          : isPast
                          ? "text-neutral-300"
                          : inMonth
                          ? "text-ink group-hover:bg-blue-100 group-hover:text-blue-700"
                          : "text-neutral-200",
                      )}
                    >
                      {inMonth ? dayNum : ""}
                    </span>
                    {/* "+" hint — only for clickable days */}
                    {isClickable && (
                      <span className="hidden text-[10px] font-semibold text-blue-400 group-hover:block">
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
                        <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", isPast ? "bg-neutral-300" : STATUS_DOT[p.status])} />
                        {fmtTime(p.scheduledFor)}
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <p className="pl-1 text-[10px] text-neutral-400">+{dayPosts.length - 3} more</p>
                    )}
                  </div>

                  {/* Lock overlay hint for past */}
                  {isPast && inMonth && (
                    <div className="absolute inset-0 rounded-none" title="Past date — cannot schedule" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold tracking-tight", color)}>{value}</p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      <span className="text-[11px] text-neutral-400">{label}</span>
    </div>
  );
}
