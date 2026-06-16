"use client";

import { Activity } from "lucide-react";
import Button from "@/components/Common/Button";
import type { ReachIssue } from "@/lib/types";

export default function ReachAnalysis({
  issues,
  analyzed,
  loading,
  onRun,
}: {
  issues: ReachIssue[];
  analyzed: boolean;
  loading: boolean;
  onRun: () => void;
}) {
  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    warning: issues.filter((i) => i.severity === "warning").length,
    good: issues.filter((i) => i.severity === "good").length,
  };
  // Simple health score: start at 100, subtract per issue weight.
  const score = Math.max(
    0,
    100 - counts.critical * 25 - counts.warning * 10,
  );

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-gradient-to-r from-brand to-action p-6 text-center text-white sm:flex-row sm:text-left">
      <div className="flex-1">
        <h2 className="flex items-center justify-center gap-2 text-lg font-bold sm:justify-start">
          <Activity className="h-5 w-5" /> Reach Debugger
        </h2>
        <p className="mt-1 text-sm text-white/90">
          {analyzed
            ? `Found ${counts.critical} critical and ${counts.warning} warnings to address.`
            : "Run an analysis to diagnose what's holding back your reach."}
        </p>
      </div>

      {analyzed && (
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-2xl font-bold">
            {score}
          </div>
          <span className="mt-1 text-xs text-white/80">Health score</span>
        </div>
      )}

      <Button
        className="bg-white text-brand hover:bg-white/90"
        onClick={onRun}
        loading={loading}
      >
        {analyzed ? "Re-run analysis" : "Run Analysis"}
      </Button>
    </div>
  );
}
