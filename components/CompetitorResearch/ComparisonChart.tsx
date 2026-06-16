"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "@/lib/constants";
import type { Competitor } from "@/lib/types";

// Your own baseline metrics for comparison.
const YOU = {
  postFrequency: 2,
  avgEngagement: 4.8,
};

export default function ComparisonChart({
  competitor,
}: {
  competitor: Competitor;
}) {
  const data = [
    {
      metric: "Posts / week",
      You: YOU.postFrequency,
      [competitor.name]: competitor.postFrequency,
    },
    {
      metric: "Avg engagement %",
      You: YOU.avgEngagement,
      [competitor.name]: competitor.avgEngagement,
    },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
          <XAxis
            dataKey="metric"
            tick={{ fontSize: 12, fill: COLORS.muted }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: COLORS.muted }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: COLORS.light }}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="You" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
          <Bar
            dataKey={competitor.name}
            fill={COLORS.warning}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
