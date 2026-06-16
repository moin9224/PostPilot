"use client";

import { useState } from "react";
import { CardSkeleton } from "@/components/Common/Loading";
import IssuesList from "@/components/ReachDebugger/IssuesList";
import ReachAnalysis from "@/components/ReachDebugger/ReachAnalysis";
import RecommendationPanel from "@/components/ReachDebugger/RecommendationPanel";
import { REACH_ISSUES, RECOMMENDATIONS } from "@/lib/mock";

export default function ReachDebuggerPage() {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  function runAnalysis() {
    setLoading(true);
    setTimeout(() => {
      setAnalyzed(true);
      setLoading(false);
    }, 1400);
  }

  return (
    <div className="space-y-6">
      <ReachAnalysis
        issues={analyzed ? REACH_ISSUES : []}
        analyzed={analyzed}
        loading={loading}
        onRun={runAnalysis}
      />

      {loading && (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!loading && analyzed && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Diagnosis
              </span>
              <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
                Issues found
              </h3>
            </div>
            <IssuesList issues={REACH_ISSUES} />
          </div>
          <div className="h-fit lg:sticky lg:top-20">
            <RecommendationPanel recommendations={RECOMMENDATIONS} />
          </div>
        </div>
      )}

      {!loading && !analyzed && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-20 text-center">
          <p className="mx-auto max-w-md text-sm leading-relaxed text-neutral-500">
            We&apos;ll check your profile, posting frequency, content quality,
            hashtag strategy and timing — then return a prioritized fix-it list
            with expected impact.
          </p>
        </div>
      )}
    </div>
  );
}
