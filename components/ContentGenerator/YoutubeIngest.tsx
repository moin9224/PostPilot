"use client";

import { useState } from "react";
import {
  AlertCircle,
  Clock,
  Loader2,
  PlayCircle,
  Quote,
  Sparkles,
  X,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoMeta {
  url: string;
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  topics: string[];
  quotes: string[];
}

interface Props {
  meta: VideoMeta | null;
  onMetaChange: (meta: VideoMeta | null) => void;
}

const STAGES = [
  "Reading the video…",
  "Transcribing audio…",
  "Extracting key quotes…",
  "Detecting topics…",
];

function parseYoutubeId(input: string): string | null {
  if (!input) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const match = input.match(re);
    if (match) return match[1];
  }
  return null;
}

const MOCK_LIBRARY = [
  {
    title: "How I built a one-person business doing $5M/year",
    channel: "Justin Welsh",
    duration: "24:18",
    topics: ["Solo entrepreneurship", "Personal brand", "Distribution"],
    quotes: [
      "You don't need 10,000 customers. You need 1,000 true believers.",
      "Distribution beats product 9 times out of 10. The best builders learn to write.",
      "Your reputation compounds faster than your bank account ever will.",
    ],
  },
  {
    title: "The future of work isn't remote — it's asynchronous",
    channel: "First Round Review",
    duration: "18:42",
    topics: ["Remote work", "Async culture", "Leadership"],
    quotes: [
      "Synchronous communication is a tax on your team's deepest work.",
      "Async-first means writing first. If your team can't write, your team can't scale.",
      "The future of work isn't where you sit. It's how you decide.",
    ],
  },
  {
    title: "Why most personal brands fail in 90 days",
    channel: "Dan Koe",
    duration: "16:05",
    topics: ["Content strategy", "Audience growth", "Positioning"],
    quotes: [
      "Most people quit at the moment compounding actually begins.",
      "Your niche isn't a topic — it's a worldview only you can articulate.",
      "Boring consistency beats clever campaigns every single quarter.",
    ],
  },
];

export default function YoutubeIngest({ meta, onMetaChange }: Props) {
  const [url, setUrl] = useState(meta?.url ?? "");
  const [fetching, setFetching] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const videoId = parseYoutubeId(url);
  const canFetch = !!videoId && !fetching;

  async function fetchVideo() {
    if (!videoId) {
      setError("Paste a valid YouTube URL.");
      return;
    }
    setError(null);
    setFetching(true);
    setStage(0);

    // Cycle through fake stages for transparency
    const stageTimer = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 450);

    setTimeout(() => {
      clearInterval(stageTimer);
      const pick =
        MOCK_LIBRARY[Math.abs(hash(videoId)) % MOCK_LIBRARY.length];
      onMetaChange({
        url,
        videoId,
        ...pick,
      });
      setFetching(false);
    }, 1900);
  }

  function clear() {
    setUrl("");
    setError(null);
    onMetaChange(null);
  }

  if (meta) return <MetaCard meta={meta} onClear={clear} />;

  return (
    <div>
      <label
        htmlFor="yt-url"
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500"
      >
        YouTube URL
      </label>
      <div className="relative">
        <Youtube className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          id="yt-url"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canFetch) {
              e.preventDefault();
              fetchVideo();
            }
          }}
          placeholder="https://youtube.com/watch?v=…"
          className={cn(
            "h-10 w-full rounded-md border bg-white pl-9 pr-3 text-[13px] text-ink placeholder:text-neutral-400 transition-colors focus:outline-none",
            error
              ? "border-error focus:border-error"
              : "border-neutral-200 focus:border-neutral-400",
          )}
        />
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-error">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={fetchVideo}
        disabled={!canFetch}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 text-[13px] font-medium text-ink transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {fetching ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500" />
            <span className="tabular-nums">{STAGES[stage]}</span>
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" />
            Read video with Gemini
          </>
        )}
      </button>

      <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
        Paste any YouTube link. We&apos;ll pull the transcript, key quotes and
        topic — Claude turns it into a LinkedIn post in your voice.
      </p>

      {/* Tip */}
      <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50/60 p-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          <Quote className="h-2.5 w-2.5" />
          Try one
        </div>
        <button
          type="button"
          onClick={() => setUrl("https://youtu.be/dQw4w9WgXcQ")}
          className="mt-1.5 block w-full truncate text-left text-[12px] text-neutral-600 transition-colors hover:text-ink"
        >
          youtu.be/dQw4w9WgXcQ
        </button>
      </div>
    </div>
  );
}

function MetaCard({
  meta,
  onClear,
}: {
  meta: VideoMeta;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Video loaded
        </span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 transition-colors hover:text-ink"
        >
          <X className="h-3 w-3" />
          Change
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {/* Thumb + title */}
        <div className="flex items-start gap-3 p-3">
          <div className="relative flex h-14 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white">
            <PlayCircle className="h-5 w-5 drop-shadow" />
            <span className="absolute bottom-0.5 right-1 rounded bg-black/60 px-1 text-[9px] font-medium tabular-nums">
              {meta.duration}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[13px] font-semibold leading-snug tracking-[-0.01em] text-ink">
              {meta.title}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="font-medium text-neutral-700">
                {meta.channel}
              </span>
              <span className="text-neutral-300">·</span>
              <Clock className="h-2.5 w-2.5" />
              {meta.duration}
            </p>
          </div>
        </div>

        {/* Topics */}
        <div className="border-t border-neutral-100 px-3 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Topics detected
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {meta.topics.map((t) => (
              <span
                key={t}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Quotes */}
        <div className="border-t border-neutral-100 px-3 py-2.5">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            <Quote className="h-2.5 w-2.5" />
            Key quotes
          </div>
          <ul className="mt-1.5 space-y-1.5">
            {meta.quotes.map((q, i) => (
              <li
                key={i}
                className="border-l-2 border-neutral-200 pl-2.5 text-[12px] leading-relaxed text-neutral-700"
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-neutral-500">
        Adjust tone & length below, then hit{" "}
        <span className="font-medium text-ink">Generate</span>.
      </p>
    </div>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
