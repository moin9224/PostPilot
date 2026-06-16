"use client";

import { cn } from "@/lib/utils";

const TOPIC_MAX = 280;

export default function TopicInput({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const count = value.length;
  const over = count > TOPIC_MAX;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor="topic"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500"
        >
          What do you want to write about?
        </label>
        <span
          className={cn(
            "text-[11px] tabular-nums",
            over ? "text-error" : "text-neutral-400",
          )}
        >
          {count} / {TOPIC_MAX}
        </span>
      </div>
      <textarea
        id="topic"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (
            (e.metaKey || e.ctrlKey) &&
            e.key === "Enter" &&
            value.trim() &&
            !over
          ) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="e.g. Lessons from scaling a remote team to 50 people"
        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[13px] leading-relaxed text-ink placeholder:text-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none"
      />
    </div>
  );
}
