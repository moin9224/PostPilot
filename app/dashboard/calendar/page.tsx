"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import StatusBadge from "@/components/Common/StatusBadge";
import Calendar from "@/components/ContentCalendar/Calendar";
import BulkScheduler from "@/components/ContentCalendar/BulkScheduler";
import ScheduleModal from "@/components/ContentCalendar/ScheduleModal";
import { POSTS } from "@/lib/mock";
import type { Post, PostStatus } from "@/lib/types";
import { cn, formatDate, formatTime, truncate } from "@/lib/utils";

const STATUS_FILTERS: { value: PostStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "failed", label: "Failed" },
];

export default function CalendarPage() {
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const filtered = useMemo(
    () => (filter === "all" ? POSTS : POSTS.filter((p) => p.status === filter)),
    [filter],
  );

  const upcoming = useMemo(
    () =>
      POSTS.filter((p) => p.status === "scheduled")
        .sort(
          (a, b) =>
            new Date(a.scheduledFor ?? a.createdAt).getTime() -
            new Date(b.scheduledFor ?? b.createdAt).getTime(),
        )
        .slice(0, 6),
    [],
  );

  const draftCount = POSTS.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-all",
                filter === f.value
                  ? "bg-ink text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-50",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button
          onClick={() => setScheduleOpen(true)}
          className="bg-ink hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> Schedule post
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Calendar posts={filtered} onSelectPost={() => setScheduleOpen(true)} />

        <div className="space-y-6">
          <BulkScheduler draftCount={draftCount} onSchedule={() => {}} />

          <Card>
            <h3 className="mb-3 font-semibold text-ink">Legend</h3>
            <ul className="space-y-2 text-sm">
              {(["scheduled", "published", "draft", "failed"] as PostStatus[]).map(
                (s) => (
                  <li key={s} className="flex items-center gap-2">
                    <StatusBadge status={s} />
                  </li>
                ),
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="mb-4 font-semibold text-ink">Upcoming scheduled posts</h3>
        {upcoming.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No upcoming posts. Schedule one to get started.
          </p>
        ) : (
          <ul className="divide-y divide-edge">
            {upcoming.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="w-28 flex-shrink-0 text-sm">
                  <p className="font-medium text-ink">
                    {p.scheduledFor && formatDate(p.scheduledFor)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.scheduledFor && formatTime(p.scheduledFor)}
                  </p>
                </div>
                <p className="min-w-0 flex-1 text-sm text-gray-700">
                  {truncate(p.text, 90)}
                </p>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ScheduleModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSchedule={() => setScheduleOpen(false)}
      />
    </div>
  );
}
