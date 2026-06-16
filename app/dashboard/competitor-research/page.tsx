"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";
import Card from "@/components/Common/Card";
import CompetitorSearch from "@/components/CompetitorResearch/CompetitorSearch";
import CompetitorCard from "@/components/CompetitorResearch/CompetitorCard";
import ComparisonChart from "@/components/CompetitorResearch/ComparisonChart";
import CompetitorPosts from "@/components/CompetitorResearch/CompetitorPosts";
import { COMPETITORS, COMPETITOR_POSTS } from "@/lib/mock";
import type { Competitor } from "@/lib/types";

let nextId = 100;

export default function CompetitorResearchPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(COMPETITORS);
  const [comparingId, setComparingId] = useState<string | null>(
    COMPETITORS[0]?.id ?? null,
  );

  function addCompetitor(url: string) {
    const handle = url.split("/").filter(Boolean).pop() ?? "competitor";
    const name = handle
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const created: Competitor = {
      id: `c${nextId++}`,
      name,
      handle,
      industry: "Unknown",
      postFrequency: 3,
      avgEngagement: 4.2,
      followers: 12000,
      topTopics: ["General"],
    };
    setCompetitors((prev) => [created, ...prev]);
  }

  function remove(id: string) {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    if (comparingId === id) setComparingId(null);
  }

  const comparing = competitors.find((c) => c.id === comparingId) ?? null;

  return (
    <div className="space-y-6">
      <Card>
        <CompetitorSearch onAdd={addCompetitor} />
      </Card>

      {competitors.length === 0 ? (
        <div className="rounded-lg border border-dashed border-edge bg-white py-16 text-center text-sm text-gray-500">
          No competitors yet. Add a LinkedIn profile URL above to start tracking.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((c) => (
            <CompetitorCard
              key={c.id}
              competitor={c}
              onRemove={remove}
              onCompare={setComparingId}
            />
          ))}
        </div>
      )}

      {comparing && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 font-semibold text-ink">
              You vs {comparing.name}
            </h3>
            <ComparisonChart competitor={comparing} />
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <h3 className="font-semibold text-ink">Opportunities</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • {comparing.name} posts {comparing.postFrequency}x/week — match
                their cadence to stay competitive.
              </li>
              <li>
                • Their top topics:{" "}
                <span className="font-medium">
                  {comparing.topTopics.join(", ")}
                </span>
                . Consider your own angle on these.
              </li>
              <li>
                • Their avg engagement is {comparing.avgEngagement}% — study
                their hooks below.
              </li>
            </ul>
          </Card>
        </div>
      )}

      <div>
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Signal
          </span>
          <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
            What&apos;s working for competitors
          </h3>
        </div>
        <CompetitorPosts posts={COMPETITOR_POSTS} />
      </div>
    </div>
  );
}
