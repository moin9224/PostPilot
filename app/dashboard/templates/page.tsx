"use client";

import { useState, useMemo } from "react";
import {
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  Ellipsis,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTemplatesByIndustry,
  getIndustries,
  searchTemplates,
} from "@/lib/templates";
import type { Template } from "@/lib/templates";

function Avatar({ name }: { name: string }) {
  const colors = [
    "from-blue-500 to-blue-700",
    "from-green-500 to-emerald-700",
    "from-purple-500 to-violet-700",
    "from-orange-500 to-amber-700",
    "from-rose-500 to-pink-700",
    "from-cyan-500 to-teal-700",
  ];
  const idx =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    colors.length;
  return (
    <div
      className={cn(
        "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white",
        colors[idx],
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function LinkedInPostCard({
  template,
  copied,
  expanded,
  onCopy,
  onToggleExpand,
}: {
  template: Template;
  copied: boolean;
  expanded: boolean;
  onCopy: () => void;
  onToggleExpand: () => void;
}) {
  const initials = template.industry
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Author bar */}
      <div className="flex items-start gap-3 px-4 pb-1 pt-4">
        <Avatar name={initials} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#191919]">
              {template.title}
            </span>
            <span className="flex h-3.5 items-center rounded-sm bg-[#0a66c2] px-1 text-[10px] font-bold text-white">
              1st
            </span>
          </div>
          <div className="text-[12px] leading-tight text-[#666666]">
            {template.industry} • Top Voice
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#666666]">
            <span>2m ago</span>
            <span>•</span>
            <span>Edited</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className="rounded-md p-1.5 text-[#666666] transition-colors hover:bg-neutral-100"
            title="Copy template"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button className="rounded-md p-1.5 text-[#666666] transition-colors hover:bg-neutral-100">
            <Ellipsis className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-2 pt-1">
        <div
          className={cn(
            "whitespace-pre-line text-[14px] leading-[1.5] text-[#191919]",
            !expanded && "line-clamp-8",
          )}
        >
          {template.text}
        </div>
        {template.text.length > 320 && (
          <button
            onClick={onToggleExpand}
            className="mt-1 text-[13px] font-semibold text-[#666666] hover:text-[#191919]"
          >
            {expanded ? "Show less" : "...see more"}
          </button>
        )}
      </div>

      {/* Engagement bar */}
      <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-1.5 text-[12px] text-[#666666]">
        <div className="flex items-center gap-0.5">
          <div className="flex -space-x-1">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0a66c2]">
              <Heart className="h-2.5 w-2.5 text-white" />
            </div>
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0a66c2]">
              <Heart className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <span>142</span>
        </div>
        <div className="flex items-center gap-3">
          <span>12 comments</span>
          <span>8 reposts</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center border-t border-neutral-100 px-2 py-0.5">
        {[
          { icon: Heart, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map((action) => (
          <button
            key={action.label}
            onClick={action.label === "Like" ? onCopy : undefined}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[13px] font-semibold text-[#666666] transition-colors hover:bg-neutral-100"
          >
            <action.icon className="h-5 w-5" />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const industries = useMemo(() => getIndustries(), []);
  const [activeIndustry, setActiveIndustry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayTemplates = useMemo(() => {
    const byIndustry = getTemplatesByIndustry(activeIndustry);
    if (!searchQuery.trim()) return byIndustry;
    return searchTemplates(searchQuery);
  }, [activeIndustry, searchQuery]);

  async function copyTemplate(template: Template) {
    try {
      await navigator.clipboard.writeText(template.text);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-ink">Templates</h1>
        <p className="text-sm text-neutral-500">
          {displayTemplates.length} templates
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search templates by title, industry, or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
        />
      </div>

      {/* Industry filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveIndustry("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            activeIndustry === "all"
              ? "border-ink bg-ink text-white"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
          )}
        >
          All
        </button>
        {industries.map((industry) => (
          <button
            key={industry}
            onClick={() => setActiveIndustry(industry)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeIndustry === industry
                ? "border-ink bg-ink text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
            )}
          >
            {industry}
          </button>
        ))}
      </div>

      {/* LinkedIn feed */}
      <div className="space-y-4">
        {displayTemplates.map((template) => (
          <LinkedInPostCard
            key={template.id}
            template={template}
            copied={copiedId === template.id}
            expanded={expandedId === template.id}
            onCopy={() => copyTemplate(template)}
            onToggleExpand={() =>
              setExpandedId(expandedId === template.id ? null : template.id)
            }
          />
        ))}
      </div>

      {displayTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
          <p className="text-sm font-medium">No templates found</p>
          <p className="mt-1 text-xs">Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
}
