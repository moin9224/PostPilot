import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  XCircle,
} from "lucide-react";
import type { IssueSeverity, ReachIssue } from "@/lib/types";

const META: Record<
  IssueSeverity,
  { icon: typeof XCircle; color: string; bg: string; label: string }
> = {
  critical: {
    icon: XCircle,
    color: "text-error",
    bg: "bg-red-50",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-amber-50",
    label: "Warning",
  },
  good: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-green-50",
    label: "Good",
  },
};

export default function IssuesList({ issues }: { issues: ReachIssue[] }) {
  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const m = META[issue.severity];
        const Icon = m.icon;
        return (
          <details
            key={issue.id}
            className="group rounded-lg border border-edge bg-white shadow-card"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${m.bg} ${m.color}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{issue.title}</p>
                <p className="truncate text-sm text-gray-500">
                  {issue.problem}
                </p>
              </div>
              <span
                className={`hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline ${m.bg} ${m.color}`}
              >
                {m.label}
              </span>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
            </summary>
            <div className="space-y-3 border-t border-edge px-4 py-4 text-sm">
              <div>
                <p className="font-medium text-ink">Why it matters</p>
                <p className="text-gray-600">{issue.why}</p>
              </div>
              <div>
                <p className="font-medium text-ink">How to fix it</p>
                <p className="text-gray-600">{issue.fix}</p>
              </div>
              <div className="rounded-md bg-mist p-3">
                <span className="font-medium text-success">
                  Expected improvement:{" "}
                </span>
                <span className="text-gray-700">
                  {issue.expectedImprovement}
                </span>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
