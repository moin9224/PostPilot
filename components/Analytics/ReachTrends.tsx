"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "@/lib/constants";

interface Datum {
  label: string;
  value: number;
}

export default function ReachTrends({ data }: { data: Datum[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: COLORS.muted }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: COLORS.muted }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            cursor={{ fill: COLORS.light }}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Engagement rate">
            {data.map((d) => (
              <Cell
                key={d.label}
                fill={d.value === max ? COLORS.primary : COLORS.secondary}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
