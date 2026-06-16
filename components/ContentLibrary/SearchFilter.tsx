"use client";

import { Search } from "lucide-react";
import Select from "@/components/Common/Select";
import { INDUSTRIES } from "@/lib/constants";
import type { PostStatus } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "failed", label: "Failed" },
];

export interface LibraryFilters {
  query: string;
  status: PostStatus | "all";
  industry: string;
}

export default function SearchFilter({
  filters,
  onChange,
}: {
  filters: LibraryFilters;
  onChange: (filters: LibraryFilters) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search posts…"
          className="h-10 w-full rounded-md border border-edge bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-action/40"
        />
      </div>
      <Select
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value as PostStatus | "all" })
        }
        className="sm:w-44"
      />
      <Select
        options={[{ value: "all", label: "All industries" }, ...INDUSTRIES]}
        value={filters.industry}
        onChange={(e) => onChange({ ...filters, industry: e.target.value })}
        className="sm:w-44"
      />
    </div>
  );
}
