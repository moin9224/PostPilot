"use client";

import { useMemo, useState } from "react";
import PostGrid from "@/components/ContentLibrary/PostGrid";
import SearchFilter, {
  type LibraryFilters,
} from "@/components/ContentLibrary/SearchFilter";
import { INDUSTRIES } from "@/lib/constants";
import { POSTS } from "@/lib/mock";

export default function ContentLibraryPage() {
  const [posts, setPosts] = useState(POSTS);
  const [filters, setFilters] = useState<LibraryFilters>({
    query: "",
    status: "all",
    industry: "all",
  });

  const industryLabel = (value: string) =>
    INDUSTRIES.find((i) => i.value === value)?.label;

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (
        filters.query &&
        !p.text.toLowerCase().includes(filters.query.toLowerCase())
      )
        return false;
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (
        filters.industry !== "all" &&
        p.industry !== industryLabel(filters.industry)
      )
        return false;
      return true;
    });
  }, [posts, filters]);

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleEdit(id: string) {
    const post = posts.find((p) => p.id === id);
    if (post) alert(`Editing post: ${post.text.slice(0, 60)}...`);
  }

  function handleSchedule(id: string) {
    const post = posts.find((p) => p.id === id);
    if (post) alert(`Scheduling post: ${post.text.slice(0, 60)}...`);
  }

  return (
    <div className="space-y-6">
      <SearchFilter filters={filters} onChange={setFilters} />
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">
          <span className="font-semibold text-ink">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "post" : "posts"}
        </p>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Sorted by newest
        </span>
      </div>
      <PostGrid
        posts={filtered}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
