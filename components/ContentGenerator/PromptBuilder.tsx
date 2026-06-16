"use client";

import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "A lesson I learned the hard way",
  "An unpopular opinion in my industry",
  "A behind-the-scenes story",
  "A mistake that taught me something",
  "A framework I use every week",
  "A myth I want to bust",
];

export default function PromptBuilder({
  onPick,
}: {
  onPick: (text: string) => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-ink" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Stuck? Start with an angle
          </span>
        </div>
        <span className="text-[11px] text-neutral-400">Tap to use</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] text-neutral-700 transition-all hover:border-ink hover:bg-ink hover:text-white"
          >
            <span className="font-mono text-[10px] text-neutral-400 transition-colors group-hover:text-white/60">
              ↳
            </span>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
