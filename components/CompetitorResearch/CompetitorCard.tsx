"use client";

import { BarChart2, Trash2 } from "lucide-react";
import Button from "@/components/Common/Button";
import type { Competitor } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

export default function CompetitorCard({
  competitor,
  onRemove,
  onCompare,
}: {
  competitor: Competitor;
  onRemove: (id: string) => void;
  onCompare: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-edge bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand text-lg font-semibold text-white">
          {competitor.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ink">{competitor.name}</h3>
          <p className="text-xs text-gray-500">
            @{competitor.handle} · {competitor.industry}
          </p>
        </div>
        <button
          onClick={() => onRemove(competitor.id)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-error"
          aria-label="Remove competitor"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label="Followers" value={formatCompact(competitor.followers)} />
        <Stat label="Posts/wk" value={String(competitor.postFrequency)} />
        <Stat label="Avg eng." value={`${competitor.avgEngagement}%`} />
      </div>

      <div className="mt-4">
        <p className="mb-1.5 text-xs font-medium text-gray-500">Top topics</p>
        <div className="flex flex-wrap gap-1.5">
          {competitor.topTopics.map((t) => (
            <span
              key={t}
              className="rounded-full bg-mist px-2 py-0.5 text-xs text-gray-600"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="mt-4 w-full"
        onClick={() => onCompare(competitor.id)}
      >
        <BarChart2 className="h-3.5 w-3.5" /> Compare
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-mist py-2">
      <p className="text-sm font-bold text-ink">{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
