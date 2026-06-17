"use client";

import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit2,
  Eye,
  Globe,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Monitor,
  PlusCircle,
  RefreshCcw,
  Repeat2,
  Send,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isPastDay(d: Date, today: Date) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()) < t;
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
  return dt.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) +
    ", " + dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function toLocalIsoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function defaultTime(d: Date) {
  const now = new Date();
  if (isSameDay(d, now)) {
    const h = now.getHours() + 2;
    return `${String(Math.min(h, 23)).padStart(2, "0")}:00`;
  }
  return "12:00";
}

const STATUS_DOT: Record<PostStatus, string> = {
  scheduled: "bg-blue-500", publishing: "bg-amber-400",
  published: "bg-emerald-500", failed: "bg-red-400",
};
const STATUS_PILL: Record<PostStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700 ring-blue-100",
  publishing: "bg-amber-50 text-amber-700 ring-amber-100",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  failed: "bg-red-50 text-red-700 ring-red-100",
};
const STATUS_LABEL: Record<PostStatus, string> = {
  scheduled: "Scheduled", publishing: "Publishing…", published: "Published", failed: "Failed",
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Media Tab ──────────────────────────────────────────────────────────── */

interface MediaTabProps {
  onAttach: (url: string) => void;
  attached: string | null;
  onRemove: () => void;
}

function MediaTab({ onAttach, attached, onRemove }: MediaTabProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleGenerate() {
    if (!aiPrompt.trim() || generating) return;
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setGenError(data.error ?? "Image generation failed. Try again.");
        return;
      }
      setGallery((prev) => [data.url, ...prev]);
      setAiPrompt("");
    } catch {
      setGenError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (url) setGallery((prev) => [url, ...prev]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (url) setGallery((prev) => [url, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* AI Generate section */}
      <div className="border-b border-neutral-100 px-4 pt-3 pb-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
          Generate with AI
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. professional team meeting, growth chart…"
            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[12px] text-ink placeholder:text-neutral-400 focus:border-violet-300 focus:bg-white focus:outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={!aiPrompt.trim() || generating}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-700 disabled:opacity-40"
          >
            {generating ? (
              <Sparkles className="h-4 w-4 animate-pulse" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </button>
        </div>
        {genError && (
          <p className="mt-1.5 text-[11px] text-red-500">{genError}</p>
        )}
        {generating && (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-violet-500">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Generating image with DALL·E 3…
          </div>
        )}
      </div>

      {/* Upload from device */}
      <div className="border-b border-neutral-100 px-4 py-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
          Upload from device
        </p>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 py-5 text-center transition-colors hover:border-violet-300 hover:bg-violet-50/30"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
            <Upload className="h-4 w-4 text-neutral-500" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-neutral-600">Click to upload or drag &amp; drop</p>
            <p className="text-[11px] text-neutral-400">PNG, JPG, GIF, WEBP up to 10MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Gallery */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {gallery.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ImageIcon className="h-8 w-8 text-neutral-200 mb-2" />
            <p className="text-[12px] text-neutral-400">No images yet</p>
            <p className="text-[11px] text-neutral-300">Generate or upload images above</p>
          </div>
        ) : (
          <>
            {attached && (
              <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 ring-1 ring-blue-100">
                <p className="text-[11px] font-semibold text-blue-700">1 image attached to post</p>
                <button onClick={onRemove} className="text-[11px] font-semibold text-blue-500 hover:text-blue-700">Remove</button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((url, i) => {
                const isAttached = attached === url;
                return (
                  <div key={i} className={cn(
                    "group relative overflow-hidden rounded-lg border-2 transition-all",
                    isAttached ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-neutral-300",
                  )}>
                    <img
                      src={url}
                      alt={`Image ${i + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    {/* Overlay actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => isAttached ? onRemove() : onAttach(url)}
                        className={cn(
                          "rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors",
                          isAttached ? "bg-blue-500 hover:bg-blue-600" : "bg-white/20 hover:bg-white/30 backdrop-blur-sm",
                        )}
                      >
                        {isAttached ? "✓ Attached" : "Use"}
                      </button>
                      <button
                        onClick={() => {
                          if (isAttached) onRemove();
                          setGallery((prev) => prev.filter((_, j) => j !== i));
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {isAttached && (
                      <div className="absolute bottom-1 left-1 rounded-md bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                        Attached
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Composer Modal ─────────────────────────────────────────────────────── */

type ComposerTab = "ai" | "drafts" | "media" | "boosts";
type PreviewMode = "edit" | "preview";
type DeviceMode = "desktop" | "mobile";

interface AiMessage { role: "user" | "ai"; text: string; }

function ComposerModal({ day, existingPosts, onClose, onScheduled }: {
  day: Date;
  existingPosts: CalendarPost[];
  onClose: () => void;
  onScheduled: (post: CalendarPost) => void;
}) {
  const [tab, setTab] = useState<ComposerTab>("ai");
  const [mode, setMode] = useState<PreviewMode>("edit");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [postText, setPostText] = useState("");
  const [time, setTime] = useState(() => defaultTime(day));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // AI
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isToday = isSameDay(day, new Date());

  const TRANSFORMS = ["Shorter", "Longer", "Bolder", "More casual", "More formal"];

  async function callGenerate(prompt: string): Promise<string> {
    const res = await fetch("/api/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: prompt, tone: "professional", industry: "general", audience: "professionals", style: "actionable" }),
    });
    const data = await res.json().catch(() => ({}));
    return data.posts?.[0]?.content ?? data.content ?? "";
  }

  async function handleAiSend() {
    if (!aiPrompt.trim() || aiLoading) return;
    const prompt = aiPrompt.trim();
    setAiMessages((p) => [...p, { role: "user", text: prompt }]);
    setAiPrompt("");
    setAiLoading(true);
    try {
      const text = await callGenerate(prompt);
      setAiMessages((p) => [...p, { role: "ai", text: text || "Could not generate. Try a different prompt." }]);
    } catch {
      setAiMessages((p) => [...p, { role: "ai", text: "Network error. Please try again." }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  async function applyTransform(label: string) {
    if (!postText.trim() || aiLoading) return;
    const prefixMap: Record<string, string> = {
      Shorter: "Make this shorter, keep the key message:",
      Longer: "Expand this with more detail and examples:",
      Bolder: "Make this bolder and more assertive:",
      "More casual": "Rewrite this in a casual, conversational tone:",
      "More formal": "Rewrite this in a formal, professional tone:",
    };
    const prompt = `${prefixMap[label] ?? label}\n\n${postText}`;
    setAiMessages((p) => [...p, { role: "user", text: label }]);
    setAiLoading(true);
    try {
      const text = await callGenerate(prompt);
      if (text) setAiMessages((p) => [...p, { role: "ai", text }]);
    } catch {} finally {
      setAiLoading(false);
    }
  }

  function useAiText(text: string) {
    setPostText(text);
    setMode("edit");
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  async function handleSchedule() {
    if (!postText.trim()) { setError("Please write your post content."); return; }
    if (postText.length > 3000) { setError("Post exceeds 3000 characters."); return; }
    const dateStr = toLocalIsoDate(day);
    const scheduledFor = new Date(`${dateStr}T${time}`).toISOString();
    if (new Date(scheduledFor) <= new Date()) { setError("Please pick a time in the future."); return; }
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postText.trim(), scheduledFor }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error ?? "Could not schedule. Try again."); return; }
      onScheduled({ id: `opt-${Date.now()}`, text: postText.trim(), status: "scheduled", scheduledFor });
      setSuccess(`Scheduled for ${fmtScheduleLabel(day, time)}`);
      setPostText("");
    } catch {
      setError("Network error. Please try again.");
    } finally { setBusy(false); }
  }

  const scheduleLabel = fmtScheduleLabel(day, time);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex h-[88vh] w-full max-w-[920px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">

        {/* ══ LEFT — AI Assist ══ */}
        <div className="flex w-[340px] flex-shrink-0 flex-col border-r border-neutral-200">

          {/* Tab bar */}
          <div className="flex items-center border-b border-neutral-200 px-1">
            {([
              { id: "ai", label: "AI Assist" },
              { id: "drafts", label: "Drafts" },
              { id: "media", label: "Media" },
              { id: "boosts", label: "Boosts", badge: true },
            ] as { id: ComposerTab; label: string; badge?: boolean }[]).map(({ id, label, badge }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-3 text-[13px] font-semibold transition-colors",
                  tab === id ? "border-b-2 border-ink text-ink" : "text-neutral-400 hover:text-neutral-600",
                )}
              >
                {label}
                {badge && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">🔥</span>
                )}
              </button>
            ))}
          </div>

          {tab === "ai" && (
            <>
              {/* Refresh icon top-right */}
              <div className="flex justify-end px-4 pt-2">
                <button onClick={() => setAiMessages([])} className="text-neutral-300 hover:text-neutral-500">
                  <RefreshCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
                {aiMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center pb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 mb-3">
                      <Sparkles className="h-5 w-5 text-violet-600" />
                    </div>
                    <p className="text-[13px] font-semibold text-ink">Ask AI to write your post</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-neutral-400 max-w-[220px]">
                      Type a topic below and AI will generate LinkedIn content for you.
                    </p>
                  </div>
                )}

                {aiMessages.map((msg, i) => (
                  <div key={i}>
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-neutral-100 px-3.5 py-2.5 text-[13px] text-ink">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-neutral-100 bg-white p-3.5 text-[13px] leading-relaxed text-ink shadow-sm">
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <div className="mt-2.5 flex items-center gap-2 border-t border-neutral-100 pt-2">
                          <button
                            onClick={() => navigator.clipboard?.writeText(msg.text)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-ink"
                          >
                            <Copy className="h-3 w-3" /> Copy
                          </button>
                          <button
                            onClick={() => useAiText(msg.text)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-violet-600 hover:text-violet-800"
                          >
                            <Edit2 className="h-3 w-3" /> Edit &amp; Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {aiLoading && (
                  <div className="rounded-xl border border-neutral-100 bg-white p-3.5 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Make it... */}
              <div className="border-t border-neutral-100 px-4 py-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[12px] text-neutral-500">Make it...</span>
                  {TRANSFORMS.map((t) => (
                    <button
                      key={t}
                      onClick={() => applyTransform(t)}
                      disabled={aiLoading || !postText.trim()}
                      className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[11px] font-semibold text-violet-600 transition-colors hover:border-violet-300 hover:bg-violet-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt input */}
              <div className="border-t border-neutral-200 p-3">
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiSend(); } }}
                    placeholder="Select an action from the library or start typing anything. Variables: [composer content]"
                    className="flex-1 resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-2.5 text-[12px] leading-relaxed text-ink placeholder:text-neutral-400 focus:border-violet-300 focus:bg-white focus:outline-none"
                  />
                  <button
                    onClick={handleAiSend}
                    disabled={!aiPrompt.trim() || aiLoading}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center self-end rounded-lg bg-rose-500 text-white transition-colors hover:bg-rose-600 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-4 text-[11px] text-neutral-400">
                  <button className="flex items-center gap-1 hover:text-neutral-600">
                    <Zap className="h-3 w-3" /> Adjust results
                  </button>
                  <button className="flex items-center gap-1 hover:text-neutral-600">
                    <span className="text-[10px]">⊞</span> Actions Library
                  </button>
                  <button className="flex items-center gap-1 hover:text-neutral-600">
                    <RefreshCcw className="h-3 w-3" /> History
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "drafts" && (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
                <Edit2 className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="text-[13px] font-semibold text-ink">No drafts yet</p>
              <p className="mt-1 text-[12px] text-neutral-400">Save a post as draft to see it here.</p>
            </div>
          )}

          {tab === "media" && (
            <MediaTab
              onAttach={(url) => {
                setAttachedImage(url);
                setMode("edit");
              }}
              attached={attachedImage}
              onRemove={() => setAttachedImage(null)}
            />
          )}

          {tab === "boosts" && (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="text-[13px] font-semibold text-ink">Coming soon</p>
              <p className="mt-1 text-[12px] text-neutral-400">Boost features are in progress.</p>
            </div>
          )}
        </div>

        {/* ══ RIGHT — Editor ══ */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
            <div>
              <p className={cn("text-[10px] font-bold uppercase tracking-[0.16em]",
                isToday ? "text-ink" : "text-blue-600"
              )}>
                {isToday ? "TODAY" : "UPCOMING"}
              </p>
              <h2 className="text-[15px] font-bold text-ink">{fmtDayFull(day)}</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Edit / Preview toggle */}
              <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-[12px]">
                <button
                  onClick={() => setMode("edit")}
                  className={cn("flex items-center gap-1 rounded-md px-2.5 py-1.5 font-semibold transition-all",
                    mode === "edit" ? "bg-white text-ink shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setMode("preview")}
                  className={cn("flex items-center gap-1 rounded-md px-2.5 py-1.5 font-semibold transition-all",
                    mode === "preview" ? "bg-white text-ink shadow-sm" : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
              </div>
              {/* Device icons (preview mode) */}
              {mode === "preview" && (
                <div className="flex items-center gap-1">
                  <button onClick={() => setDevice("desktop")} className={cn("rounded-md p-1.5 transition-colors", device === "desktop" ? "bg-neutral-100 text-ink" : "text-neutral-400 hover:text-neutral-600")}>
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDevice("mobile")} className={cn("rounded-md p-1.5 transition-colors", device === "mobile" ? "bg-neutral-100 text-ink" : "text-neutral-400 hover:text-neutral-600")}>
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Existing posts strip */}
          {existingPosts.length > 0 && (
            <div className="flex flex-wrap gap-2 border-b border-neutral-100 px-5 py-2.5">
              {existingPosts.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5">
                  <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[p.status])} />
                  <span className="text-[11px] font-medium text-neutral-600">{fmtTime(p.scheduledFor)}</span>
                  <span className={cn("rounded-full px-1.5 py-px text-[10px] font-semibold ring-1 ring-inset", STATUS_PILL[p.status])}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700 ring-1 ring-emerald-100">
              <CalendarCheck className="h-4 w-4 flex-shrink-0" />
              <span><span className="font-semibold">Post scheduled!</span> {success}</span>
              <Link href="/dashboard/calendar" className="ml-auto text-[12px] font-semibold text-emerald-700 underline underline-offset-2" onClick={onClose}>View calendar →</Link>
            </div>
          )}

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            {mode === "edit" ? (
              <div className="flex h-full flex-col">
                <textarea
                  ref={textareaRef}
                  value={postText}
                  onChange={(e) => { setPostText(e.target.value); setError(""); }}
                  placeholder="Write your LinkedIn post here…"
                  className={cn(
                    "w-full resize-none border-0 bg-white p-5 text-[14px] leading-relaxed text-ink placeholder:text-neutral-300 focus:outline-none",
                    attachedImage ? "min-h-[160px]" : "min-h-[300px] flex-1"
                  )}
                />
                {/* Attached image preview */}
                {attachedImage && (
                  <div className="relative mx-5 mb-4 overflow-hidden rounded-xl border border-neutral-200">
                    <img
                      src={attachedImage}
                      alt="Attached"
                      className="w-full object-cover max-h-48 rounded-xl"
                    />
                    <button
                      onClick={() => setAttachedImage(null)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Image attached
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Preview mode — LinkedIn card */
              <div className={cn("p-5", device === "mobile" ? "max-w-[375px] mx-auto" : "")}>
                {postText ? (
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                    <div className="flex items-start gap-3 px-4 pt-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">Y</div>
                      <div>
                        <p className="text-[13px] font-semibold text-ink">Your Name</p>
                        <p className="text-[11px] text-neutral-500">Your headline · 1st</p>
                        <p className="flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5">Now · <Globe className="h-2.5 w-2.5" /></p>
                      </div>
                    </div>
                    <div className="px-4 pt-3 pb-4">
                      <p className="whitespace-pre-line text-[13px] leading-relaxed text-ink">{postText}</p>
                    </div>
                    {attachedImage && (
                      <img src={attachedImage} alt="Post image" className="w-full object-cover max-h-52" />
                    )}
                    <div className="flex items-center gap-1.5 border-t border-neutral-100 px-4 py-2 text-[11px] text-neutral-500">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600"><Heart className="h-2 w-2 fill-white text-white" /></span>
                      <span>1,284 · 86 comments</span>
                    </div>
                    <div className="flex items-center justify-around border-t border-neutral-100 px-2 py-1.5 text-[11px] text-neutral-500">
                      {[{ icon: <Heart className="h-3.5 w-3.5" />, label: "Like" }, { icon: <MessageCircle className="h-3.5 w-3.5" />, label: "Comment" }, { icon: <Repeat2 className="h-3.5 w-3.5" />, label: "Repost" }, { icon: <Send className="h-3.5 w-3.5" />, label: "Send" }].map(({ icon, label }) => (
                        <button key={label} className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-neutral-100">{icon} {label}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center text-[13px] text-neutral-400">
                    No post content yet
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="mx-5 mb-2 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600 ring-1 ring-red-100">{error}</p>
          )}

          {/* Bottom bar */}
          <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3">
            {/* Left: char count + time */}
            <div className="flex items-center gap-3">
              <span className={cn("text-[12px] font-medium tabular-nums", postText.length > 3000 ? "text-red-500" : "text-neutral-400")}>
                {postText.length}/3000
              </span>
              <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => { setTime(e.target.value); setError(""); }}
                  className="w-[88px] border-0 bg-transparent text-[12px] font-medium text-ink focus:outline-none"
                />
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-neutral-200 px-3.5 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setPostText("")}
                className="hidden items-center gap-1.5 rounded-lg border border-neutral-200 px-3.5 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50 sm:flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> New draft
              </button>
              <button
                onClick={handleSchedule}
                disabled={busy || !postText.trim() || postText.length > 3000}
                className="flex items-center gap-0 overflow-hidden rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                <span className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold transition-colors hover:bg-blue-700">
                  <CalendarCheck className="h-4 w-4" />
                  Schedule Post
                </span>
                <span className="hidden border-l border-blue-500 px-2.5 py-2 text-[12px] font-medium text-blue-200 hover:bg-blue-700 sm:block">
                  {scheduleLabel}
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

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const [{ data: gp }, { data: sp }] = await Promise.all([
        supabase.from("generated_posts").select("id, content, status, scheduled_for").eq("user_id", user.id).not("scheduled_for", "is", null).order("scheduled_for", { ascending: true }),
        supabase.from("scheduled_posts_v2").select("id, text, status, scheduled_for").eq("user_id", user.id).order("scheduled_for", { ascending: true }),
      ]);
      const fromGP: CalendarPost[] = (gp ?? []).map((p) => ({ id: `gp-${p.id}`, text: p.content, status: p.status as PostStatus, scheduledFor: p.scheduled_for! }));
      const fromSP: CalendarPost[] = (sp ?? []).map((p) => ({ id: `sp-${p.id}`, text: p.text, status: p.status as PostStatus, scheduledFor: p.scheduled_for }));
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

  const firstDOW = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const totalCells = Math.ceil((firstDOW + totalDays) / 7) * 7;

  function prevMonth() { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); setComposerDay(null); }
  function nextMonth() { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); setComposerDay(null); }
  function postsForDay(d: Date) { return posts.filter((p) => isSameDay(new Date(p.scheduledFor), d)); }

  const stats = {
    scheduled: posts.filter((p) => p.status === "scheduled" || p.status === "publishing").length,
    published: posts.filter((p) => p.status === "published").length,
    failed: posts.filter((p) => p.status === "failed").length,
    total: posts.length,
  };

  return (
    <div className="space-y-6">
      {composerDay && (
        <ComposerModal
          day={composerDay}
          existingPosts={postsForDay(composerDay)}
          onClose={() => setComposerDay(null)}
          onScheduled={(post) => {
            setPosts((prev) => [...prev, post].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)));
          }}
        />
      )}

      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">Content Calendar</h1>
          <p className="mt-1 text-sm text-neutral-500">Click any upcoming date to schedule a post.</p>
        </div>
        <Link href="/dashboard/content-generator">
          <button className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-[13px] font-semibold text-white hover:bg-neutral-800 transition-colors">
            <Sparkles className="h-4 w-4" /> Generate post
          </button>
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Scheduled", value: stats.scheduled, color: "text-blue-600" },
          { label: "Published", value: stats.published, color: "text-emerald-600" },
          { label: "Failed", value: stats.failed, color: "text-red-500" },
          { label: "Total queued", value: stats.total, color: "text-ink" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
            <p className={cn("mt-1 text-2xl font-bold tracking-tight", color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {/* Month nav */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50">
              <ChevronLeft className="h-4 w-4 text-neutral-500" />
            </button>
            <h2 className="min-w-[140px] text-center text-sm font-semibold text-ink">
              {new Date(year, month).toLocaleDateString([], { month: "long", year: "numeric" })}
            </h2>
            <button onClick={nextMonth} className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50">
              <ChevronRight className="h-4 w-4 text-neutral-500" />
            </button>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            {[{ color: "bg-neutral-200", label: "Past" }, { color: "bg-blue-500", label: "Scheduled" }, { color: "bg-emerald-500", label: "Published" }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", color)} />
                <span className="text-[11px] text-neutral-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekday row */}
        <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/50">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">{d}</div>
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
                  onClick={() => isClickable && setComposerDay(cellDate)}
                  className={cn(
                    "group relative min-h-[100px] border-b border-r border-neutral-100 p-2 transition-colors",
                    isLastRow && "border-b-0",
                    (i + 1) % 7 === 0 && "border-r-0",
                    !inMonth && "bg-neutral-50/30",
                    isPast && "cursor-default bg-neutral-50/40",
                    isClickable && "cursor-pointer hover:bg-blue-50/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-medium transition-colors",
                      isToday ? "bg-ink text-white" : isPast ? "text-neutral-300" : inMonth ? "text-ink group-hover:bg-blue-100 group-hover:text-blue-700" : "text-neutral-200",
                    )}>
                      {inMonth ? dayNum : ""}
                    </span>
                    {isClickable && (
                      <span className="hidden text-[10px] font-semibold text-blue-400 group-hover:block">+ Add</span>
                    )}
                  </div>
                  <div className="mt-1.5 space-y-0.5">
                    {dayPosts.slice(0, 3).map((p) => (
                      <div key={p.id} className={cn(
                        "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                        isPast ? "bg-neutral-100 text-neutral-400" : "bg-white text-neutral-600 shadow-sm ring-1 ring-neutral-200",
                      )}>
                        <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", isPast ? "bg-neutral-300" : STATUS_DOT[p.status])} />
                        {fmtTime(p.scheduledFor)}
                      </div>
                    ))}
                    {dayPosts.length > 3 && <p className="pl-1 text-[10px] text-neutral-400">+{dayPosts.length - 3} more</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
