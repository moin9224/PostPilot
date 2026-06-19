"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Globe,
  Heart,
  HelpCircle,
  MessageCircle,
  Pencil,
  Repeat2,
  Send,
  Settings2,
  Sparkles,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import YoutubeIngest, {
  type VideoMeta,
} from "@/components/ContentGenerator/YoutubeIngest";
import ScheduleModal from "@/components/ContentCalendar/ScheduleModal";
import UpgradeModal from "@/components/Billing/UpgradeModal";
import type { GeneratedPost } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Source = "idea" | "url";
type Variation = "Actionable" | "Storytelling" | "Thought-provoking" | "Promotional";
type Format = "Short-form" | "Long-form" | "List" | "Story arc";
type Tone = "Professional" | "Casual" | "Bold" | "Inspirational" | "Educational";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const VARIATIONS: Variation[] = ["Actionable", "Storytelling", "Thought-provoking", "Promotional"];
const FORMATS: Format[] = ["Short-form", "Long-form", "List", "Story arc"];
const TONES: Tone[] = ["Professional", "Casual", "Bold", "Inspirational", "Educational"];

const VARIATION_STYLE_MAP: Record<Variation, string> = {
  Actionable: "actionable",
  Storytelling: "storytelling",
  "Thought-provoking": "thought-provoking",
  Promotional: "promotional",
};

const SUGGEST_TOPICS = [
  "My biggest lesson from 5 years of building in public",
  "Why most LinkedIn posts fail (and what actually works)",
  "3 things I wish I knew before starting my career",
  "The uncomfortable truth about AI replacing jobs",
  "How I went from 0 to 10k followers without posting every day",
];

/* ─── Helper ─────────────────────────────────────────────────────────────── */

function zonedToUtcIso(date: string, time: string, timeZone: string) {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const utcGuess = Date.UTC(y, mo - 1, d, h, mi);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(new Date(utcGuess)).map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second),
  );
  return new Date(utcGuess - (asUtc - utcGuess)).toISOString();
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ContentGeneratorPage() {
  const [source, setSource] = useState<Source>("idea");
  const [topic, setTopic] = useState("");
  const [variation, setVariation] = useState<Variation>("Actionable");
  const [format, setFormat] = useState<Format>("Short-form");
  const [tone, setTone] = useState<Tone>("Professional");
  const [showFormatEdit, setShowFormatEdit] = useState(false);
  const [videoMeta, setVideoMeta] = useState<VideoMeta | null>(null);

  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<GeneratedPost | null>(null);
  const [copied, setCopied] = useState(false);

  const [scheduling, setScheduling] = useState<GeneratedPost | null>(null);
  const [scheduleBusy, setScheduleBusy] = useState(false);
  const [scheduleNotice, setScheduleNotice] = useState<
    { kind: "success" | "error"; text: string } | null
  >(null);

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{
    plan: string;
    limit: number;
    used: number;
    period: "day" | "week";
  } | null>(null);

  const canSubmit = source === "idea"
    ? topic.trim().length > 0 && topic.length <= 500
    : !!videoMeta;

  function suggestTopic() {
    const random = SUGGEST_TOPICS[Math.floor(Math.random() * SUGGEST_TOPICS.length)];
    setTopic(random);
  }

  async function handleGenerate() {
    if (!canSubmit) return;
    setLoading(true);
    setPosts([]);
    setSelected(null);

    const topicText = source === "url" && videoMeta
      ? `${videoMeta.title} — ${videoMeta.quotes[0]}`
      : topic;

    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicText,
          tone: tone.toLowerCase(),
          industry: "general",
          audience: "professionals",
          style: VARIATION_STYLE_MAP[variation],
          format: format.toLowerCase(),
        }),
      });
      const data = await res.json();

      // Handle usage limit exceeded
      if (res.status === 429) {
        setUsageInfo(data.usage || { plan: "free", limit: 1, used: 1, period: "week" });
        setShowUpgrade(true);
        return;
      }

      if (!res.ok) { alert(data.error || "Failed to generate"); return; }

      const generated: GeneratedPost[] = data.posts.map((p: any) => ({
        id: p.id || crypto.randomUUID(),
        text: p.content,
        hashtags: p.hashtags || [],
        characterCount: p.characterCount,
        estimatedReach: p.estimatedReach,
        suggestedBestTime: p.suggestedBestTime,
        tone,
        industry: "general",
      }));
      setPosts(generated);
      setSelected(generated[0] ?? null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSchedule(when: { date: string; time: string; tz: string; linkedinAccountId: string }) {
    if (!scheduling) return;
    const scheduledFor = zonedToUtcIso(when.date, when.time, when.tz);
    if (new Date(scheduledFor).getTime() <= Date.now()) {
      setScheduleNotice({ kind: "error", text: "Pick a date and time in the future." });
      return;
    }
    setScheduleBusy(true);
    setScheduleNotice(null);
    try {
      const res = await fetch("/api/posts/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: scheduling.text,
          scheduledFor,
          linkedinAccountId: when.linkedinAccountId,
          hashtags: scheduling.hashtags,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setScheduleNotice({ kind: "error", text: data.error ?? "Could not schedule." });
        return;
      }
      setScheduleNotice({
        kind: "success",
        text: `Scheduled for ${new Date(scheduledFor).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
      });
      setScheduling(null);
    } catch {
      setScheduleNotice({ kind: "error", text: "Network error. Try again." });
    } finally {
      setScheduleBusy(false);
    }
  }

  function copyPost(text: string) {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-0">

      {/* ── Schedule banner ── */}
      {scheduleNotice && (
        <div className={cn(
          "mb-4 flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm ring-1",
          scheduleNotice.kind === "success"
            ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
            : "bg-red-50 text-red-700 ring-red-200",
        )}>
          <div className="flex items-center gap-2.5">
            {scheduleNotice.kind === "success"
              ? <CalendarCheck className="h-4 w-4 flex-shrink-0 text-emerald-600" />
              : <X className="h-4 w-4 flex-shrink-0 text-red-500" />}
            <span>
              <span className="font-semibold">{scheduleNotice.kind === "success" ? "Post scheduled! " : "Error: "}</span>
              {scheduleNotice.text}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {scheduleNotice.kind === "success" && (
              <Link href="/dashboard/calendar" className="whitespace-nowrap font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
                View in Calendar →
              </Link>
            )}
            <button onClick={() => setScheduleNotice(null)} className="rounded p-0.5 hover:bg-black/10">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between pb-5">
        <h1 className="text-xl font-bold tracking-[-0.02em] text-ink">
          Find ideas and generate a viral post
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFormatEdit((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <Settings2 className="h-3.5 w-3.5 text-violet-500" />
            Adjust AI
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-500 transition-colors hover:bg-neutral-50">
            <HelpCircle className="h-3.5 w-3.5" />
            Feeling stuck?
          </button>
        </div>
      </div>

      {/* ── Source Tabs ── */}
      <div className="mb-5 flex gap-0 border-b border-neutral-200">
        <TabButton active={source === "idea"} onClick={() => { setSource("idea"); setPosts([]); setSelected(null); }}>
          <Pencil className="h-3.5 w-3.5" /> From an idea
        </TabButton>
        <TabButton active={source === "url"} onClick={() => { setSource("url"); setPosts([]); setSelected(null); }}>
          <Youtube className="h-3.5 w-3.5 text-red-500" /> From a URL
        </TabButton>
      </div>

      {/* ── Main Input Area ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">

        {/* Left: Topic + Variations */}
        <div className="space-y-4">
          {/* Post topic */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-bold text-ink">Post topic</h2>
                <p className="text-[12px] text-neutral-500">Share your idea, we&apos;ll turn it into LinkedIn-ready posts.</p>
              </div>
              <button
                onClick={suggestTopic}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-[12px] font-semibold text-violet-700 transition-colors hover:bg-violet-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Suggest topic
              </button>
            </div>

            {source === "idea" ? (
              <>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
                  placeholder="For example: A post summarizing my lessons from 5 years of building in public..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-[13px] leading-relaxed text-ink placeholder:text-neutral-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 transition-colors"
                />
                <p className="mt-1.5 text-[11px] text-neutral-400">1–3 sentences · ⌘↵ to generate</p>
              </>
            ) : (
              <YoutubeIngest meta={videoMeta} onMetaChange={setVideoMeta} />
            )}
          </div>

          {/* Post variations */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-ink">Post variations</h2>
              <p className="text-[12px] text-neutral-500">1 selected · 1 AI credit per variant</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {VARIATIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariation(v)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all",
                    variation === v
                      ? "border-ink bg-ink text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-ink",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Format & Tone */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">Format &amp; tone</h2>
            <button
              onClick={() => setShowFormatEdit((v) => !v)}
              className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700"
            >
              {showFormatEdit ? <><ChevronUp className="h-3.5 w-3.5" /> Close</> : <><Pencil className="h-3 w-3" /> Edit</>}
            </button>
          </div>

          {!showFormatEdit ? (
            /* Summary view */
            <div className="space-y-3">
              <FormatRow label="Format" value={format} />
              <FormatRow label="Tone" value={tone} />
              <FormatRow label="Angle" value={variation} />
              <FormatRow label="Structure" value="Auto" />
              <p className="mt-4 rounded-lg bg-neutral-50 p-3 text-[12px] leading-relaxed text-neutral-500">
                Topic and variations are on the left. When you&apos;re ready, click{" "}
                <span className="font-semibold text-ink">Generate posts</span> below.
              </p>
            </div>
          ) : (
            /* Edit view */
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Format</label>
                <div className="flex flex-wrap gap-1.5">
                  {FORMATS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        "rounded-md border px-3 py-1 text-[12px] font-medium transition-all",
                        format === f ? "border-ink bg-ink text-white" : "border-neutral-200 text-neutral-600 hover:border-neutral-300",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">Tone</label>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        "rounded-md border px-3 py-1 text-[12px] font-medium transition-all",
                        tone === t ? "border-ink bg-ink text-white" : "border-neutral-200 text-neutral-600 hover:border-neutral-300",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Generate Button ── */}
      <div className="mt-4">
        <button
          onClick={handleGenerate}
          disabled={!canSubmit || loading}
          className={cn(
            "w-full rounded-xl py-3.5 text-[15px] font-bold tracking-[-0.01em] transition-all",
            canSubmit && !loading
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5)]"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed",
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Generating posts…
            </span>
          ) : (
            source === "url" ? "Generate from video" : "Generate posts"
          )}
        </button>
      </div>

      {/* ── Posts Area ── */}
      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            <LoadingCard delay="0ms" />
            <LoadingCard delay="100ms" />
            <LoadingCard delay="200ms" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyPostsArea />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            {/* Post cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-ink">
                  {posts.length} posts generated
                </p>
                <p className="text-[12px] text-neutral-500">
                  Click a post to preview it on LinkedIn →
                </p>
              </div>
              {posts.map((p, i) => (
                <PostCard
                  key={p.id}
                  post={p}
                  index={i}
                  isSelected={selected?.id === p.id}
                  onSelect={() => setSelected(p)}
                  onCopy={() => copyPost(p.text)}
                  onSchedule={() => setScheduling(p)}
                  copied={copied && selected?.id === p.id}
                />
              ))}
            </div>

            {/* Right: LinkedIn preview + coaching */}
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <LinkedInPreviewCard text={selected?.text} hashtags={selected?.hashtags ?? []} />
              {selected && (
                <CoachingCard
                  post={selected}
                  tone={tone}
                  onCopy={() => copyPost(selected.text)}
                  onSchedule={() => setScheduling(selected)}
                  copied={copied}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <ScheduleModal
        isOpen={!!scheduling}
        onClose={() => setScheduling(null)}
        preview={scheduling?.text}
        busy={scheduleBusy}
        onSchedule={handleSchedule}
      />

      {usageInfo && (
        <UpgradeModal
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          currentPlan="free"
          usageInfo={usageInfo}
        />
      )}
    </div>
  );
}

/* ─── Subcomponents ───────────────────────────────────────────────────────── */

function TabButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors",
        active
          ? "border-ink text-ink"
          : "border-transparent text-neutral-400 hover:text-neutral-600",
      )}
    >
      {children}
    </button>
  );
}

function FormatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-0">
      <span className="text-[12px] text-neutral-500">{label}</span>
      <span className="text-[12px] font-semibold text-ink">{value}</span>
    </div>
  );
}

function PostCard({ post, index, isSelected, onSelect, onCopy, onSchedule, copied }: {
  post: GeneratedPost;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onSchedule: () => void;
  copied: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = post.text.slice(0, 180);
  const hasMore = post.text.length > 180;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-xl border bg-white p-5 transition-all hover:border-blue-200 hover:shadow-sm",
        isSelected ? "border-blue-300 ring-1 ring-blue-200 shadow-sm" : "border-neutral-200",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-600">
            {index + 1}
          </span>
          <span className="text-[11px] font-semibold text-neutral-500">
            Est. {formatNumber(post.estimatedReach)} reach · {post.characterCount} chars
          </span>
        </div>
        {isSelected && (
          <span className="rounded-full bg-blue-50 px-2 py-px text-[10px] font-bold uppercase tracking-wider text-blue-600 ring-1 ring-blue-100">
            Selected
          </span>
        )}
      </div>

      <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink">
        {expanded ? post.text : preview}
        {!expanded && hasMore && "…"}
      </p>

      {hasMore && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
          className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-700"
        >
          {expanded ? <><ChevronUp className="h-3.5 w-3.5" /> Show less</> : <><ChevronDown className="h-3.5 w-3.5" /> Read more</>}
        </button>
      )}

      {post.hashtags.length > 0 && (
        <p className="mt-2 text-[12px] font-medium text-blue-600">
          {post.hashtags.join(" ")}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3">
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSchedule(); }}
          className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          Schedule post
        </button>
      </div>
    </div>
  );
}

function LinkedInPreviewCard({ text, hashtags }: { text?: string; hashtags: string[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Live preview</p>
          <h3 className="mt-0.5 text-[13px] font-semibold text-ink">On LinkedIn</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-start gap-2.5 px-4 pt-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">Y</div>
            <div>
              <p className="text-[13px] font-semibold text-ink">Your Name</p>
              <p className="text-[11px] text-neutral-500">Your headline · 1st</p>
              <p className="flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5">Now · <Globe className="h-2.5 w-2.5" /></p>
            </div>
          </div>
          <div className="px-4 pt-3 pb-4">
            {text ? (
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink">{text}</p>
            ) : (
              <p className="text-[13px] text-neutral-400">Select a post to preview how it looks on LinkedIn.</p>
            )}
            {hashtags.length > 0 && (
              <p className="mt-2 text-[12px] font-medium text-blue-600">{hashtags.join(" ")}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 border-t border-neutral-100 px-4 py-2 text-[11px] text-neutral-500">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
              <Heart className="h-2 w-2 fill-white text-white" />
            </span>
            <span>1,284 · 86 comments</span>
          </div>
          <div className="flex items-center justify-around border-t border-neutral-100 px-2 py-1.5 text-[11px] text-neutral-500">
            {[
              { icon: <Heart className="h-3.5 w-3.5" />, label: "Like" },
              { icon: <MessageCircle className="h-3.5 w-3.5" />, label: "Comment" },
              { icon: <Repeat2 className="h-3.5 w-3.5" />, label: "Repost" },
              { icon: <Send className="h-3.5 w-3.5" />, label: "Send" },
            ].map(({ icon, label }) => (
              <button key={label} className="flex items-center gap-1.5 rounded-md px-2 py-2 sm:py-1 hover:bg-neutral-100">
                {icon} <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CoachingCard({ post, tone, onCopy, onSchedule, copied }: {
  post: GeneratedPost; tone: string; onCopy: () => void; onSchedule: () => void; copied: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Coaching</p>
      <h3 className="mt-0.5 mb-4 text-[13px] font-semibold text-ink">Post analysis</h3>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200">
        {[
          { label: "Est. reach", value: formatNumber(post.estimatedReach) },
          { label: "Read time", value: `${Math.max(1, Math.round(post.characterCount / 5 / 200))} min` },
          { label: "Best time", value: post.suggestedBestTime ?? "—" },
          { label: "Characters", value: post.characterCount.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
        <InsightRow text={<>Optimised for <span className="font-medium text-ink">{tone.toLowerCase()}</span> tone.</>} />
        <InsightRow
          text={post.hashtags.length > 0
            ? `${post.hashtags.length} hashtags added for discoverability.`
            : "Consider adding 2–3 hashtags to boost discoverability."}
          warn={post.hashtags.length === 0}
        />
        <InsightRow text="Add 1–2 line breaks after the opening hook for better mobile readability." warn />
      </ul>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onCopy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-[12px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={onSchedule}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink py-2 text-[12px] font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <Send className="h-3.5 w-3.5" /> Schedule
        </button>
      </div>
    </div>
  );
}

function InsightRow({ text, warn }: { text: React.ReactNode; warn?: boolean }) {
  return (
    <li className="flex items-start gap-2 text-[12px] leading-relaxed text-neutral-700">
      <span className={cn("mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full", warn ? "bg-amber-400" : "bg-emerald-500")} />
      <span>{text}</span>
    </li>
  );
}

function EmptyPostsArea() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
        <Sparkles className="h-5 w-5 text-neutral-400" />
      </div>
      <h3 className="mt-4 text-[15px] font-bold text-ink">Your posts will appear here</h3>
      <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-neutral-500">
        Fill in your idea above and click &ldquo;Generate posts&rdquo; to see drafts here.
      </p>
    </div>
  );
}

function LoadingCard({ delay }: { delay: string }) {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-5" style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-40 rounded bg-neutral-100" />
        <div className="h-4 w-16 rounded bg-neutral-100" />
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-neutral-100" />
        <div className="h-3 w-11/12 rounded bg-neutral-100" />
        <div className="h-3 w-9/12 rounded bg-neutral-100" />
        <div className="h-3 w-10/12 rounded bg-neutral-100" />
      </div>
      <div className="mt-4 flex gap-2 pt-3 border-t border-neutral-100">
        <div className="h-8 w-20 rounded-lg bg-neutral-100" />
        <div className="h-8 w-28 rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}
