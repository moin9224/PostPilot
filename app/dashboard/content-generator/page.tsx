"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Check,
  Copy,
  Globe,
  Heart,
  History,
  MessageCircle,
  PlayCircle,
  Repeat2,
  Send,
  Sparkles,
  Wand2,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import GeneratorPanel, {
  type GeneratorSettings,
} from "@/components/ContentGenerator/GeneratorPanel";
import PromptBuilder from "@/components/ContentGenerator/PromptBuilder";
import ContentPreview from "@/components/ContentGenerator/ContentPreview";
import SourceTabs, {
  type Source,
} from "@/components/ContentGenerator/SourceTabs";
import TopicInput from "@/components/ContentGenerator/TopicInput";
import YoutubeIngest, {
  type VideoMeta,
} from "@/components/ContentGenerator/YoutubeIngest";
import ScheduleModal from "@/components/ContentCalendar/ScheduleModal";
import type { GeneratedPost } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

type SortKey = "reach" | "concise" | "order";

export default function ContentGeneratorPage() {
  const [source, setSource] = useState<Source>("topic");
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);

  const [settings, setSettings] = useState<GeneratorSettings>({
    topic: "",
    tone: "Professional",
    industry: "tech",
    audience: "founders",
    length: "Medium",
  });
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<GeneratedPost | null>(null);
  const [scheduling, setScheduling] = useState<GeneratedPost | null>(null);
  const [sort, setSort] = useState<SortKey>("reach");
  const [copied, setCopied] = useState(false);
  const [scheduleBusy, setScheduleBusy] = useState(false);
  const [scheduleNotice, setScheduleNotice] = useState<
    { kind: "success" | "error"; text: string; scheduledFor?: string } | null
  >(null);

  /**
   * Convert a wall-clock date/time in the given IANA timezone to a UTC ISO
   * string, so the server stores the exact instant the user intended
   * regardless of the browser's local timezone.
   */
  function zonedToUtcIso(date: string, time: string, timeZone: string) {
    const [y, mo, d] = date.split("-").map(Number);
    const [h, mi] = time.split(":").map(Number);
    const utcGuess = Date.UTC(y, mo - 1, d, h, mi);
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = Object.fromEntries(
      dtf.formatToParts(new Date(utcGuess)).map((p) => [p.type, p.value]),
    );
    const asUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    const offset = asUtc - utcGuess;
    return new Date(utcGuess - offset).toISOString();
  }

  async function handleSchedule(when: { date: string; time: string; tz: string }) {
    if (!scheduling) return;
    const scheduledFor = zonedToUtcIso(when.date, when.time, when.tz);

    if (new Date(scheduledFor).getTime() <= Date.now()) {
      setScheduleNotice({ kind: "error", text: "Pick a date and time in the future." });
      return;
    }

    setScheduleBusy(true);
    setScheduleNotice(null);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: scheduling.text, scheduledFor }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setScheduleNotice({
          kind: "error",
          text: data.error ?? "Could not schedule the post. Please try again.",
        });
        return;
      }

      setScheduleNotice({
        kind: "success",
        text: `Scheduled for ${new Date(scheduledFor).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}.`,
        scheduledFor,
      });
      setScheduling(null);
    } catch {
      setScheduleNotice({
        kind: "error",
        text: "Network error while scheduling. Please try again.",
      });
    } finally {
      setScheduleBusy(false);
    }
  }

  // Source rules
  const canSubmit =
    source === "topic"
      ? settings.topic.trim().length > 0 && settings.topic.length <= 280
      : !!videoMeta;
  const ctaLabel =
    source === "youtube"
      ? "Generate from video"
      : "Generate post";

  async function handleGenerate() {
    if (!canSubmit) return;
    setLoading(true);
    setPosts([]);
    setSelected(null);

    const topic =
      source === "youtube" && videoMeta
        ? `${videoMeta.title} — ${videoMeta.quotes[0]}`
        : settings.topic;

    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone: settings.tone.toLowerCase(),
          industry: settings.industry,
          audience: settings.audience,
          style: settings.length.toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to generate post");
        return;
      }

      const generated: GeneratedPost[] = data.posts.map((p: any) => ({
        id: p.id || crypto.randomUUID(),
        text: p.content,
        hashtags: p.hashtags || [],
        characterCount: p.characterCount,
        estimatedReach: p.estimatedReach,
        suggestedBestTime: p.suggestedBestTime,
        tone: settings.tone,
        industry: settings.industry,
      }));

      setPosts(generated);
      setSelected(generated[0] || null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate(id: string) {
    setLoading(true);
    try {
      const topic =
        source === "youtube" && videoMeta ? videoMeta.title : settings.topic;
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone: settings.tone.toLowerCase(),
          industry: settings.industry,
          audience: settings.audience,
          style: settings.length.toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to regenerate");
        return;
      }
      const p = data.posts[0];
      const fresh: GeneratedPost = {
        id: p.id || id,
        text: p.content,
        hashtags: p.hashtags || [],
        characterCount: p.characterCount,
        estimatedReach: p.estimatedReach,
        suggestedBestTime: p.suggestedBestTime,
        tone: settings.tone,
        industry: settings.industry,
      };
      setPosts((prev) => prev.map((post) => (post.id === id ? fresh : post)));
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function copySelected() {
    if (!selected) return;
    navigator.clipboard?.writeText(selected.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Switching source clears the prior output so the user is never confused
  // about whether the variations came from the topic or the video.
  function handleSourceChange(next: Source) {
    if (next === source) return;
    setSource(next);
    setPosts([]);
    setSelected(null);
  }

  const sortedPosts = [...posts].sort((a, b) => {
    if (sort === "reach") return b.estimatedReach - a.estimatedReach;
    if (sort === "concise") return a.characterCount - b.characterCount;
    return 0;
  });

  const avgReach = posts.length
    ? Math.round(posts.reduce((a, p) => a + p.estimatedReach, 0) / posts.length)
    : 0;
  const bestReach = posts.length
    ? Math.max(...posts.map((p) => p.estimatedReach))
    : 0;

  return (
    <div className="space-y-6">
      {/* Schedule success / error banner */}
      {scheduleNotice && (
        <div
          className={cn(
            "flex items-start justify-between gap-4 rounded-xl px-4 py-3 text-sm ring-1",
            scheduleNotice.kind === "success"
              ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
              : "bg-red-50 text-red-700 ring-red-200",
          )}
        >
          <div className="flex items-center gap-2.5">
            {scheduleNotice.kind === "success" ? (
              <CalendarCheck className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            ) : (
              <X className="h-4 w-4 flex-shrink-0 text-red-500" />
            )}
            <span>
              <span className="font-semibold">
                {scheduleNotice.kind === "success" ? "Post scheduled! " : "Error: "}
              </span>
              {scheduleNotice.text}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {scheduleNotice.kind === "success" && (
              <Link
                href="/dashboard/calendar"
                className="whitespace-nowrap font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
              >
                View in Calendar →
              </Link>
            )}
            <button
              onClick={() => setScheduleNotice(null)}
              className="rounded p-0.5 hover:bg-black/10"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Page header */}
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            OpenAI GPT-4o
          </span>
          {source === "youtube" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-medium">
              <Youtube className="h-3 w-3 text-red-600" />
              Video to post
            </span>
          )}
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline text-neutral-500">
            AI-powered LinkedIn post generator
          </span>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
          <History className="h-3.5 w-3.5" />
          Recent generations
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        {/* LEFT: Brief */}
        <Card className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto">
          <div className="mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Brief
            </span>
            <h2 className="mt-1 flex items-center gap-2 text-base font-semibold tracking-[-0.01em] text-ink">
              <Wand2 className="h-4 w-4 text-ink" /> AI Generator
            </h2>
          </div>

          <div className="mb-5">
            <SourceTabs value={source} onChange={handleSourceChange} />
          </div>

          <GeneratorPanel
            settings={settings}
            onChange={setSettings}
            onGenerate={handleGenerate}
            loading={loading}
            canSubmit={canSubmit}
            ctaLabel={ctaLabel}
            sourceSlot={
              source === "topic" ? (
                <TopicInput
                  value={settings.topic}
                  onChange={(v) => setSettings({ ...settings, topic: v })}
                  onSubmit={handleGenerate}
                />
              ) : (
                <YoutubeIngest meta={videoMeta} onMetaChange={setVideoMeta} />
              )
            }
          />
        </Card>

        {/* MIDDLE: Variations */}
        <div className="space-y-4">
          {source === "topic" ? (
            <PromptBuilder
              onPick={(text) => setSettings((s) => ({ ...s, topic: text }))}
            />
          ) : (
            videoMeta && <VideoOriginBanner meta={videoMeta} />
          )}

          {!loading && posts.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Variations
                  </div>
                  <div className="mt-0.5 text-sm font-semibold tracking-[-0.01em] text-ink">
                    {posts.length} drafts ready
                  </div>
                </div>
                <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
                <div className="hidden items-center gap-4 text-[11px] text-neutral-500 sm:flex">
                  <Stat label="Best" value={formatNumber(bestReach)} />
                  <Stat label="Avg" value={formatNumber(avgReach)} />
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-xs">
                {(
                  [
                    { k: "reach", label: "Reach" },
                    { k: "concise", label: "Concise" },
                    { k: "order", label: "Order" },
                  ] as { k: SortKey; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.k}
                    onClick={() => setSort(opt.k)}
                    className={cn(
                      "rounded px-2.5 py-1 font-medium transition-all",
                      sort === opt.k
                        ? "bg-white text-ink shadow-sm"
                        : "text-neutral-500 hover:text-ink",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-3">
              <LoadingCard delay="0ms" />
              <LoadingCard delay="120ms" />
              <LoadingCard delay="240ms" />
            </div>
          )}

          {!loading && posts.length === 0 && (
            <EmptyState source={source} hasMeta={!!videoMeta} />
          )}

          {!loading && posts.length > 0 && (
            <ContentPreview
              posts={sortedPosts}
              selectedId={selected?.id}
              onSelect={setSelected}
              onRegenerate={handleRegenerate}
              onDelete={handleDelete}
              onSchedule={(p) => setScheduling(p)}
            />
          )}
        </div>

        {/* RIGHT: Preview & Coaching */}
        <div className="space-y-4 xl:sticky xl:top-20 xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto">
          <LinkedInPreviewCard
            text={selected?.text}
            hashtags={selected?.hashtags ?? []}
          />

          {selected ? (
            <Card>
              <div className="mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Coaching
                </span>
                <h3 className="mt-1 text-sm font-semibold tracking-[-0.01em] text-ink">
                  Post analysis
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200">
                <Metric
                  label="Est. reach"
                  value={formatNumber(selected.estimatedReach)}
                />
                <Metric
                  label="Read time"
                  value={`${Math.max(1, Math.round(selected.characterCount / 5 / 200))} min`}
                />
                <Metric
                  label="Best time"
                  value={selected.suggestedBestTime ?? "—"}
                />
                <Metric
                  label="Characters"
                  value={selected.characterCount.toLocaleString()}
                />
              </div>

              <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                {source === "youtube" && videoMeta && (
                  <Insight
                    text={
                      <>
                        Pulled the strongest quote from{" "}
                        <span className="font-medium text-ink">
                          {videoMeta.channel}
                        </span>{" "}
                        — credit will land in comments.
                      </>
                    }
                  />
                )}
                <Insight
                  text={
                    <>
                      Optimised for{" "}
                      <span className="font-medium text-ink">
                        {settings.industry}
                      </span>{" "}
                      audience with{" "}
                      <span className="font-medium text-ink">
                        {settings.tone.toLowerCase()}
                      </span>{" "}
                      tone.
                    </>
                  }
                />
                <Insight
                  text={
                    <>
                      {selected.hashtags.length > 0
                        ? `${selected.hashtags.length} hashtags added for discoverability.`
                        : "Consider adding 2–3 hashtags to boost discoverability."}
                    </>
                  }
                  warn={selected.hashtags.length === 0}
                />
                <Insight
                  text="Add 1–2 line breaks after the opening hook for better mobile readability."
                  warn
                />
              </ul>

              <div className="mt-5 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={copySelected}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-ink hover:bg-neutral-800"
                  onClick={() => setScheduling(selected)}
                >
                  <Send className="h-3.5 w-3.5" />
                  Schedule
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="border-dashed">
              <p className="text-center text-[12px] leading-relaxed text-neutral-500">
                Pick a variation to see predicted reach, hook score and a
                LinkedIn-true preview.
              </p>
            </Card>
          )}
        </div>
      </div>

      <ScheduleModal
        isOpen={!!scheduling}
        onClose={() => setScheduling(null)}
        preview={scheduling?.text}
        busy={scheduleBusy}
        onSchedule={handleSchedule}
      />

    </div>
  );
}

/* ---------- Subcomponents ---------- */

function VideoOriginBanner({ meta }: { meta: VideoMeta }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
      <div className="relative flex h-12 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white">
        <PlayCircle className="h-4 w-4 drop-shadow" />
        <span className="absolute bottom-0.5 right-1 rounded bg-black/60 px-1 text-[9px] font-medium tabular-nums">
          {meta.duration}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          <Youtube className="h-2.5 w-2.5 text-red-600" />
          Source video
        </div>
        <p className="mt-0.5 line-clamp-1 text-[13px] font-semibold tracking-[-0.01em] text-ink">
          {meta.title}
        </p>
        <p className="text-[11px] text-neutral-500">
          {meta.channel} · {meta.topics.slice(0, 2).join(" · ")}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
        {value}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink tabular-nums">
        {value}
      </div>
    </div>
  );
}

function Insight({
  text,
  warn,
}: {
  text: React.ReactNode;
  warn?: boolean;
}) {
  return (
    <li className="flex items-start gap-2 text-[13px] leading-relaxed text-neutral-700">
      <span
        className={cn(
          "mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full",
          warn ? "bg-warning" : "bg-success",
        )}
      />
      <span>{text}</span>
    </li>
  );
}

function EmptyState({
  source,
  hasMeta,
}: {
  source: Source;
  hasMeta: boolean;
}) {
  const ytIdle = source === "youtube" && !hasMeta;
  const ytReady = source === "youtube" && hasMeta;

  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.4)]">
          {ytIdle || ytReady ? (
            <Youtube className="h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </div>
        <h3 className="mt-5 text-base font-semibold tracking-[-0.01em] text-ink">
          {ytIdle
            ? "Paste a YouTube link to begin"
            : ytReady
              ? "Video ready — hit Generate"
              : "Your variations land here"}
        </h3>
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-neutral-500">
          {ytIdle ? (
            <>
              We&apos;ll pull the transcript, quotes and topic — Claude turns it
              into a LinkedIn post in your voice.
            </>
          ) : ytReady ? (
            <>
              Adjust tone, audience and length on the left, then{" "}
              <span className="font-medium text-ink">Generate from video</span>.
            </>
          ) : (
            <>
              Drop a topic on the left and hit{" "}
              <span className="font-medium text-ink">Generate</span> —
              you&apos;ll get 7 ready-to-post drafts ranked by predicted reach.
            </>
          )}
        </p>
        <div className="mt-6 flex items-center gap-1.5 text-[11px] text-neutral-400">
          <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono">
            ⌘
          </kbd>
          <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono">
            ↵
          </kbd>
          <span>to generate</span>
        </div>
      </div>
    </div>
  );
}

function LoadingCard({ delay }: { delay: string }) {
  return (
    <div
      className="animate-pulse rounded-xl border border-neutral-200 bg-white p-5"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 rounded bg-neutral-100" />
        <div className="h-3 w-32 rounded bg-neutral-100" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 w-11/12 rounded bg-neutral-100" />
        <div className="h-3 w-9/12 rounded bg-neutral-100" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-16 rounded bg-neutral-100" />
        <div className="h-6 w-20 rounded bg-neutral-100" />
      </div>
    </div>
  );
}

function LinkedInPreviewCard({
  text,
  hashtags,
}: {
  text?: string;
  hashtags: string[];
}) {
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Live preview
          </span>
          <h3 className="mt-0.5 text-sm font-semibold tracking-[-0.01em] text-ink">
            On LinkedIn
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="rounded-lg border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-start gap-2.5 px-4 pt-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-action text-sm font-semibold text-white">
              Y
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[13px] font-semibold text-ink">
                Your Name
              </p>
              <p className="truncate text-[11px] text-neutral-500">
                Your headline
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-400">
                Now · <Globe className="h-2.5 w-2.5" />
              </p>
            </div>
          </div>

          <div className="px-4 pt-3">
            {text ? (
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink">
                {text}
              </p>
            ) : (
              <p className="text-[13px] leading-relaxed text-neutral-400">
                Select a variation to preview how it renders on LinkedIn —
                avatar, headline, hashtags and engagement row included.
              </p>
            )}
            {hashtags.length > 0 && (
              <p className="mt-2 text-[12px] font-medium text-brand">
                {hashtags.join(" ")}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center gap-1.5 px-4 text-[11px] text-neutral-500">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand">
              <Heart className="h-2 w-2 fill-white text-white" />
            </span>
            <span>1,284 · 86 comments</span>
          </div>

          <div className="mt-3 flex items-center justify-around border-t border-neutral-100 px-2 py-1.5 text-[11px] text-neutral-500">
            <Reaction icon={<Heart className="h-3.5 w-3.5" />} label="Like" />
            <Reaction
              icon={<MessageCircle className="h-3.5 w-3.5" />}
              label="Comment"
            />
            <Reaction
              icon={<Repeat2 className="h-3.5 w-3.5" />}
              label="Repost"
            />
            <Reaction icon={<Send className="h-3.5 w-3.5" />} label="Send" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Reaction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-neutral-100">
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
