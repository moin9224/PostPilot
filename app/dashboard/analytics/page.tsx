"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import EngagementMetrics from "@/components/Analytics/EngagementMetrics";
import PerformanceChart from "@/components/Analytics/PerformanceChart";
import ReachTrends from "@/components/Analytics/ReachTrends";
import TopPosts from "@/components/Analytics/TopPosts";
import { ANALYTICS_METRICS, DOW_DATA, POSTS, TREND_DATA } from "@/lib/mock";
import { cn } from "@/lib/utils";

const RANGES = [
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("30");

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-all",
                range === r.value
                  ? "bg-ink text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-50",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm">
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      <EngagementMetrics metrics={ANALYTICS_METRICS} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Engagement
            </span>
            <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
              Trend over time
            </h3>
          </div>
          <PerformanceChart data={TREND_DATA} />
        </Card>
        <Card>
          <div className="mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              When to post
            </span>
            <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
              Engagement by day of week
            </h3>
          </div>
          <ReachTrends data={DOW_DATA} />
        </Card>
      </div>

      <Card padded={false}>
        <div className="border-b border-neutral-100 px-6 py-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            History
          </span>
          <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
            All posts
          </h3>
        </div>
        <div className="p-6">
          <TopPosts posts={POSTS} />
        </div>
      </Card>
    </div>
  );
}
