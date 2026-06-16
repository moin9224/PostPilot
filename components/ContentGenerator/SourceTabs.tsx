"use client";

import { FileText, Mic, Pencil, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

export type Source = "topic" | "youtube" | "podcast" | "article";

const SOURCES: {
  key: Source;
  label: string;
  icon: typeof Pencil;
  available: boolean;
}[] = [
  { key: "topic", label: "Topic", icon: Pencil, available: true },
  { key: "youtube", label: "YouTube", icon: Youtube, available: true },
  { key: "podcast", label: "Podcast", icon: Mic, available: false },
  { key: "article", label: "Article", icon: FileText, available: false },
];

export default function SourceTabs({
  value,
  onChange,
}: {
  value: Source;
  onChange: (s: Source) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        Source
      </span>
      <div className="grid grid-cols-4 gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
        {SOURCES.map(({ key, label, icon: Icon, available }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              disabled={!available}
              onClick={() => available && onChange(key)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 rounded px-1.5 py-2 text-[11px] font-medium transition-all",
                active
                  ? "bg-white text-ink shadow-sm"
                  : available
                    ? "text-neutral-500 hover:text-ink"
                    : "cursor-not-allowed text-neutral-300",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
              {!available && (
                <span className="absolute -top-1 right-1 rounded-full bg-neutral-200 px-1 py-px text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
