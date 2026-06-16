"use client";

import type { ReactNode } from "react";
import { Command, CornerDownLeft, Sparkles } from "lucide-react";
import Button from "@/components/Common/Button";
import Select from "@/components/Common/Select";
import ToneSelector from "./ToneSelector";
import IndustrySelector from "./IndustrySelector";
import { AUDIENCES, LENGTHS } from "@/lib/constants";
import type { Length, Tone } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface GeneratorSettings {
  topic: string;
  tone: Tone;
  industry: string;
  audience: string;
  length: Length;
}

interface GeneratorPanelProps {
  settings: GeneratorSettings;
  onChange: (settings: GeneratorSettings) => void;
  onGenerate: () => void;
  loading: boolean;
  /** The source block (TopicInput, YoutubeIngest, etc.) rendered above tone/industry. */
  sourceSlot: ReactNode;
  /** Whether the Generate button is enabled. Computed by the page based on active source. */
  canSubmit: boolean;
  /** CTA label override (e.g. "Generate from video"). */
  ctaLabel?: string;
}

const LENGTH_META: Record<Length, string> = {
  Short: "~80w",
  Medium: "~180w",
  Long: "~300w",
};

export default function GeneratorPanel({
  settings,
  onChange,
  onGenerate,
  loading,
  sourceSlot,
  canSubmit,
  ctaLabel,
}: GeneratorPanelProps) {
  function update<K extends keyof GeneratorSettings>(
    key: K,
    value: GeneratorSettings[K],
  ) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="space-y-5">
      {/* Source slot — Topic textarea or YouTube ingest */}
      {sourceSlot}

      <div className="h-px bg-neutral-100" />

      <ToneSelector
        value={settings.tone}
        onChange={(tone) => update("tone", tone)}
      />

      {/* Industry & Audience */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <FieldLabel label="Industry">
          <IndustrySelector
            value={settings.industry}
            onChange={(industry) => update("industry", industry)}
          />
        </FieldLabel>
        <FieldLabel label="Audience">
          <Select
            options={AUDIENCES}
            value={settings.audience}
            onChange={(e) => update("audience", e.target.value)}
            aria-label="Audience"
          />
        </FieldLabel>
      </div>

      {/* Length */}
      <div>
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Length
        </span>
        <div className="flex items-center gap-0.5 rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
          {LENGTHS.map((len) => (
            <button
              key={len}
              type="button"
              onClick={() => update("length", len)}
              className={cn(
                "flex-1 rounded px-2 py-1.5 text-center text-[12px] font-medium transition-all",
                settings.length === len
                  ? "bg-white text-ink shadow-sm"
                  : "text-neutral-500 hover:text-ink",
              )}
            >
              <span>{len}</span>
              <span className="ml-1 text-[10px] text-neutral-400">
                {LENGTH_META[len]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button
        className="w-full bg-ink hover:bg-neutral-800"
        size="lg"
        onClick={onGenerate}
        loading={loading}
        disabled={!canSubmit}
      >
        <Sparkles className="h-4 w-4" />
        {loading
          ? "Generating…"
          : (ctaLabel ?? "Generate post")}
        {!loading && (
          <kbd className="ml-auto inline-flex items-center gap-0.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/80">
            <Command className="h-2.5 w-2.5" />
            <CornerDownLeft className="h-2.5 w-2.5" />
          </kbd>
        )}
      </Button>

      <p className="-mt-2 text-center text-[11px] text-neutral-400">
        Powered by OpenAI · Uses 1 credit per generation
      </p>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </span>
      {children}
    </div>
  );
}
