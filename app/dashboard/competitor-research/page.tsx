"use client";

import { Users, Search, Inbox } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";

export default function CompetitorResearchPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">
          Competitor Research
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track and analyze competitors on LinkedIn.
        </p>
      </header>

      <Card>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for a competitor by LinkedIn profile URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-ink focus:outline-none"
            />
          </div>
          <Button disabled={!search.trim()}>Add competitor</Button>
        </div>
      </Card>

      <Card>
        <div className="py-12 text-center">
          <Users className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm text-neutral-500">
            No competitors added yet
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Add competitor profiles to start tracking their content performance.
          </p>
        </div>
      </Card>
    </div>
  );
}
