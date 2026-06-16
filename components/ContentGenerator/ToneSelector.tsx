"use client";

import { Briefcase, Coffee, Flame, GraduationCap } from "lucide-react";
import type { Tone } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE_META: Record<
  Tone,
  { icon: typeof Briefcase; hint: string }
> = {
  Professional: { icon: Briefcase, hint: "Crisp & direct" },
  Casual: { icon: Coffee, hint: "Friendly & warm" },
  Inspiring: { icon: Flame, hint: "Bold & rousing" },
  Educational: { icon: GraduationCap, hint: "Teach a thing" },
};

const TONES: Tone[] = ["Professional", "Casual", "Inspiring", "Educational"];

export default function ToneSelector({
  value,
  onChange,
}: {
  value: Tone;
  onChange: (tone: Tone) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Tone
        </span>
        <span className="text-[11px] text-neutral-400">{TONE_META[value].hint}</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {TONES.map((tone) => {
          const { icon: Icon } = TONE_META[tone];
          const active = value === tone;
          return (
            <button
              key={tone}
              type="button"
              onClick={() => onChange(tone)}
              className={cn(
                "group flex items-center gap-2 rounded-md border px-2.5 py-2 text-left text-[13px] font-medium transition-all",
                active
                  ? "border-ink bg-ink text-white shadow-sm"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
              )}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{tone}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
