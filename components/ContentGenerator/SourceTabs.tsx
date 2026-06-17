"use client";

import { Pencil, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

export type Source = "topic" | "youtube";

const SOURCES: {
  key: Source;
  label: string;
  icon: typeof Pencil;
}[] = [
  { key: "topic", label: "Topic", icon: Pencil },
  { key: "youtube", label: "YouTube", icon: Youtube },
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
      <div className="grid grid-cols-2 gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
        {SOURCES.map(({ key, label, icon: Icon }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded px-1.5 py-2 text-[11px] font-medium transition-all",
                active
                  ? "bg-white text-ink shadow-sm"
                  : "text-neutral-500 hover:text-ink",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
