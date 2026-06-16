"use client";

import {
  Calendar,
  Check,
  Copy,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { GeneratedPost } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

interface ContentPreviewProps {
  posts: GeneratedPost[];
  onSelect: (post: GeneratedPost) => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
  onSchedule: (post: GeneratedPost) => void;
  selectedId?: string;
}

function reachTier(reach: number, all: number[]): "high" | "mid" | "low" {
  const max = Math.max(...all);
  const ratio = reach / max;
  if (ratio > 0.85) return "high";
  if (ratio > 0.6) return "mid";
  return "low";
}

const TIER_META = {
  high: { label: "High reach", className: "bg-emerald-50 text-success ring-emerald-100" },
  mid: { label: "Solid reach", className: "bg-blue-50 text-action ring-blue-100" },
  low: { label: "Niche reach", className: "bg-neutral-100 text-neutral-600 ring-neutral-200" },
} as const;

export default function ContentPreview({
  posts,
  onSelect,
  onRegenerate,
  onDelete,
  onSchedule,
  selectedId,
}: ContentPreviewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const reaches = posts.map((p) => p.estimatedReach);

  function copy(post: GeneratedPost) {
    navigator.clipboard?.writeText(post.text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-3">
      {posts.map((post, i) => {
        const selected = selectedId === post.id;
        const tier = reachTier(post.estimatedReach, reaches);
        const meta = TIER_META[tier];
        return (
          <article
            key={post.id}
            onClick={() => onSelect(post)}
            className={cn(
              "group relative cursor-pointer rounded-xl border bg-white transition-all",
              selected
                ? "border-ink shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)]"
                : "border-neutral-200 hover:border-neutral-300 hover:shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]",
            )}
          >
            {selected && (
              <span className="absolute left-0 top-6 h-8 w-0.5 rounded-r-full bg-ink" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-[11px] font-mono font-semibold text-neutral-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                    meta.className,
                  )}
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  {meta.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                <span className="tabular-nums">
                  <span className="font-semibold text-ink">
                    {formatNumber(post.estimatedReach)}
                  </span>{" "}
                  est. reach
                </span>
                <span className="text-neutral-300">·</span>
                <span className="tabular-nums">{post.characterCount} chars</span>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink">
                {post.text}
              </p>
              {post.hashtags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[12px] font-medium text-brand"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Footer toolbar */}
            <div className="flex items-center justify-between border-t border-neutral-100 px-3 py-2">
              <div className="flex items-center gap-0.5">
                <ToolbarBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(post);
                  }}
                  icon={
                    copiedId === post.id ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )
                  }
                  label={copiedId === post.id ? "Copied" : "Copy"}
                />
                <ToolbarBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegenerate(post.id);
                  }}
                  icon={<RefreshCw className="h-3.5 w-3.5" />}
                  label="Regenerate"
                />
                <ToolbarBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post.id);
                  }}
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  label="Delete"
                  danger
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSchedule(post);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-neutral-800"
              >
                <Calendar className="h-3 w-3" />
                Schedule
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ToolbarBtn({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors",
        danger
          ? "text-neutral-500 hover:bg-red-50 hover:text-error"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-ink",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
