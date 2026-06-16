import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Icon from "@/components/Common/Icon";
import type { MetricCard } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function EngagementMetrics({
  metrics,
}: {
  metrics: MetricCard[];
}) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => {
        const up = m.change >= 0;
        return (
          <div key={m.label} className="bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                {m.label}
              </span>
              {m.icon && (
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-neutral-600">
                  <Icon name={m.icon} className="h-3 w-3" />
                </span>
              )}
            </div>
            <p className="mt-4 text-[28px] font-semibold tracking-[-0.02em] text-ink">
              {m.value}
            </p>
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
                up ? "bg-emerald-50 text-success" : "bg-red-50 text-error",
              )}
            >
              {up ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(m.change)}%
            </div>
            <span className="ml-1.5 text-[11px] text-neutral-400">
              vs last period
            </span>
          </div>
        );
      })}
    </div>
  );
}
