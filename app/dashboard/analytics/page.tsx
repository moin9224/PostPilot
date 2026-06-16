"use client";

import { useState } from "react";
import { Download, TrendingUp, Eye, Heart, MessageCircle, Share2, Target } from "lucide-react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import EngagementMetrics from "@/components/Analytics/EngagementMetrics";
import PerformanceChart from "@/components/Analytics/PerformanceChart";
import ReachTrends from "@/components/Analytics/ReachTrends";
import TopPosts from "@/components/Analytics/TopPosts";
import { ANALYTICS_METRICS, DOW_DATA, POSTS, TREND_DATA } from "@/lib/mock";
import { cn } from "@/lib/utils";

const RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("30");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-ink">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Track your LinkedIn performance and find what works
        </p>
      </div>

      {/* Date Range + Actions */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={cn(
                "rounded px-4 py-1.5 text-xs font-medium transition-all",
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
          Export report
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total reach"
          value="182K"
          change="+24%"
          icon={<Eye className="h-5 w-5" />}
          color="bg-blue-100 text-blue-700"
        />
        <MetricCard
          label="Engagement rate"
          value="4.8%"
          change="+3.2%"
          icon={<Heart className="h-5 w-5" />}
          color="bg-rose-100 text-rose-700"
        />
        <MetricCard
          label="Comments"
          value="342"
          change="+18%"
          icon={<MessageCircle className="h-5 w-5" />}
          color="bg-emerald-100 text-emerald-700"
        />
        <MetricCard
          label="Shares"
          value="156"
          change="+12%"
          icon={<Share2 className="h-5 w-5" />}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Reach Trend */}
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">
                Reach trend
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Impressions over time
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs font-semibold text-success">+24%</span>
            </div>
          </div>
          <PerformanceChart data={TREND_DATA} />
        </Card>

        {/* Best Times to Post */}
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-ink">
                Best times to post
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Engagement by day
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <Target className="h-4 w-4 text-amber-700" />
            </div>
          </div>
          <ReachTrends data={DOW_DATA} />
          <div className="mt-4 border-t border-neutral-100 pt-3 text-[11px] text-neutral-600">
            <span className="font-semibold text-ink">Pro tip:</span> Post on Tuesday mornings for best reach
          </div>
        </Card>
      </div>

      {/* Insights Section */}
      <Card>
        <div className="mb-5">
          <h3 className="text-base font-semibold text-ink">
            Key insights
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InsightCard
            title="Highest engagement"
            value="8.2%"
            description="Post about AI & machine learning gets most reactions"
            icon="🎯"
          />
          <InsightCard
            title="Best performing time"
            value="9:00 AM"
            description="Tuesday mornings are ideal for your audience"
            icon="⏰"
          />
          <InsightCard
            title="Average reach"
            value="14.5K"
            description="Up from 11.2K last month"
            icon="📊"
          />
        </div>
      </Card>

      {/* All Posts Table */}
      <Card padded={false}>
        <div className="border-b border-neutral-100 px-6 py-4">
          <h3 className="text-base font-semibold text-ink">
            Top performing posts
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            Your most engaged content
          </p>
        </div>
        <div className="p-6">
          <TopPosts posts={POSTS.slice(0, 5)} />
        </div>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ label, value, change, icon, color }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
          <p className="mt-2 text-xs font-medium text-success">{change} vs last period</p>
        </div>
        <div className={`rounded-lg p-2.5 ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
}

function InsightCard({ title, value, description, icon }: InsightCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
        </div>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-neutral-600">
        {description}
      </p>
    </div>
  );
}
