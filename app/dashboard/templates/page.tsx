"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Search, ChevronDown, ChevronUp } from "lucide-react";
import Card from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import { cn } from "@/lib/utils";
import { getTemplatesByIndustry, getIndustries, searchTemplates } from "@/lib/templates";
import type { Template } from "@/lib/templates";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-ink">Templates</h1>
        <p className="text-sm text-neutral-500">{displayTemplates.length} templates</p>
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

      {/* Template cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayTemplates.map((template) => {
          const expanded = expandedId === template.id;
          return (
            <Card key={template.id} padded={false}>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between gap-2 border-b border-neutral-100 px-4 py-2.5">
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                    {template.industry}
                  </span>
                  <button
                    onClick={() => copyTemplate(template)}
                    className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                    title="Copy template"
                  >
                    {copiedId === template.id ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <div className="flex-1 space-y-2 px-4 py-3">
                  <h3 className="text-sm font-semibold text-ink leading-snug">
                    {template.title}
                  </h3>
                  <div className="relative">
                    <p
                      className={cn(
                        "text-xs leading-relaxed text-neutral-600 whitespace-pre-line",
                        !expanded && "line-clamp-6",
                      )}
                    >
                      {template.text}
                    </p>
                    {template.text.length > 280 && (
                      <button
                        onClick={() =>
                          setExpandedId(expanded ? null : template.id)
                        }
                        className="mt-1 flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-ink"
                      >
                        {expanded ? (
                          <>Show less <ChevronUp className="h-3 w-3" /></>
                        ) : (
                          <>Show more <ChevronDown className="h-3 w-3" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="border-t border-neutral-100 px-4 py-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => copyTemplate(template)}
                  >
                    {copiedId === template.id ? (
                      <>Copied</>
                    ) : (
                      <>Copy to clipboard</>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
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
