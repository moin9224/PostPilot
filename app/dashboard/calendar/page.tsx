"use client";

import { Plus, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2, Zap } from "lucide-react";
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

const STATUS_FILTERS: { value: PostStatus | "all"; label: string; color: string }[] = [
  { value: "all", label: "All posts", color: "bg-neutral-100" },
  { value: "scheduled", label: "Scheduled", color: "bg-blue-100" },
  { value: "draft", label: "Drafts", color: "bg-yellow-100" },
  { value: "published", label: "Published", color: "bg-green-100" },
  { value: "failed", label: "Failed", color: "bg-red-100" },
];

export default function CalendarPage() {
  const [filter, setFilter] = useState<PostStatus | "all">("scheduled");
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
        .slice(0, 10),
    [],
  );

  const stats = {
    scheduled: POSTS.filter((p) => p.status === "scheduled").length,
    drafts: POSTS.filter((p) => p.status === "draft").length,
    published: POSTS.filter((p) => p.status === "published").length,
    total: POSTS.length,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-ink">
            Content Calendar
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Plan, schedule, and track all your LinkedIn posts
          </p>
        </div>
        <Button
          onClick={() => setScheduleOpen(true)}
          className="w-full bg-brand hover:bg-brand/90 md:w-auto"
        >
          <Plus className="h-4 w-4" />
          New post
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Scheduled" value={stats.scheduled} icon="📅" highlight={filter === "scheduled"} />
        <StatBox label="Drafts" value={stats.drafts} icon="📝" highlight={filter === "draft"} />
        <StatBox label="Published" value={stats.published} icon="✅" highlight={filter === "published"} />
        <StatBox label="Total" value={stats.total} icon="📊" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Calendar Section */}
        <Card padded={false} className="lg:min-h-[600px]">
          <div className="border-b border-neutral-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-ink">Calendar view</h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {filter === "all" ? "All posts" : `${filter} posts`}
                </p>
              </div>
              <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      "rounded px-3 py-1.5 text-xs font-medium transition-all",
                      filter === f.value
                        ? "bg-white text-ink shadow-sm"
                        : "text-neutral-600 hover:text-ink",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6">
            <Calendar posts={filtered} onSelectPost={() => setScheduleOpen(true)} />
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Bulk Scheduler */}
          {stats.drafts > 0 && (
            <Card className="border-blue-200 bg-blue-50/50">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">
                    Quick schedule
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    You have <span className="font-semibold">{stats.drafts}</span> drafts ready to schedule
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {}}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Batch schedule
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Upcoming Posts Preview */}
          <Card padded={false}>
            <div className="border-b border-neutral-100 px-4 py-3">
              <h3 className="font-semibold text-ink">
                Coming up
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Next {upcoming.length} posts
              </p>
            </div>
            {upcoming.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Clock className="mx-auto h-8 w-8 text-neutral-300" />
                <p className="mt-2 text-sm text-neutral-500">
                  No scheduled posts
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-3 w-full"
                  onClick={() => setScheduleOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Schedule one
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {upcoming.map((post) => (
                  <li
                    key={post.id}
                    className="group px-4 py-3 transition-colors hover:bg-neutral-50 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-neutral-100 text-[10px] font-bold text-neutral-600">
                        {new Date(post.scheduledFor || "").getDate()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium text-neutral-500">
                          {post.scheduledFor && formatTime(post.scheduledFor)}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-ink group-hover:text-brand">
                          {truncate(post.text, 50)}
                        </p>
                      </div>
                      <StatusBadge status={post.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Legend */}
          <Card>
            <h3 className="mb-3 text-sm font-semibold text-ink">Legend</h3>
            <div className="space-y-2">
              {[
                { status: "scheduled" as PostStatus, label: "Scheduled" },
                { status: "published" as PostStatus, label: "Published" },
                { status: "draft" as PostStatus, label: "Draft" },
                { status: "failed" as PostStatus, label: "Failed" },
              ].map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  <span className="text-xs text-neutral-600">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ScheduleModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSchedule={() => setScheduleOpen(false)}
      />
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
  icon: string;
  highlight?: boolean;
}

function StatBox({ label, value, icon, highlight }: StatBoxProps) {
  return (
    <Card
      className={cn(
        "transition-all",
        highlight
          ? "border-brand bg-brand/5"
          : "border-neutral-200"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Card>
  );
}
