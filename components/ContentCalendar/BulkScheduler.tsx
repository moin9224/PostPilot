"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Common/Button";
import Select from "@/components/Common/Select";

const SPACING_OPTIONS = [
  { value: "1", label: "1 per day" },
  { value: "2", label: "Every 2 days" },
  { value: "3", label: "3 per week" },
  { value: "7", label: "Weekly" },
];

export default function BulkScheduler({
  draftCount,
  onSchedule,
}: {
  draftCount: number;
  onSchedule: (spacing: string) => void;
}) {
  const [spacing, setSpacing] = useState("3");

  return (
    <div className="rounded-lg border border-edge bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <CalendarPlus className="h-4 w-4 text-brand" />
        <h3 className="font-semibold text-ink">Bulk scheduler</h3>
      </div>
      <p className="mb-3 text-sm text-gray-500">
        Auto-distribute your {draftCount} drafts across optimal time slots.
      </p>
      <Select
        label="Cadence"
        options={SPACING_OPTIONS}
        value={spacing}
        onChange={(e) => setSpacing(e.target.value)}
      />
      <Button
        className="mt-3 w-full"
        onClick={() => onSchedule(spacing)}
        disabled={draftCount === 0}
      >
        Schedule all drafts
      </Button>
    </div>
  );
}
