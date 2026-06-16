"use client";

import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/types";
import { formatDate, formatNumber, truncate } from "@/lib/utils";

type SortKey = "date" | "impressions" | "engagementRate" | "comments" | "shares";

export default function TopPosts({ posts }: { posts: Post[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [asc, setAsc] = useState(false);

  const published = useMemo(
    () => posts.filter((p) => p.stats),
    [posts],
  );

  const sorted = useMemo(() => {
    const arr = [...published];
    arr.sort((a, b) => {
      let av: number;
      let bv: number;
      if (sortKey === "date") {
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
      } else {
        av = a.stats![sortKey];
        bv = b.stats![sortKey];
      }
      return asc ? av - bv : bv - av;
    });
    return arr;
  }, [published, sortKey, asc]);

  function toggle(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "impressions", label: "Reach" },
    { key: "engagementRate", label: "Eng. rate" },
    { key: "comments", label: "Comments" },
    { key: "shares", label: "Shares" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-edge text-xs uppercase tracking-wide text-gray-500">
            <th className="px-3 py-3 font-medium">Post</th>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-3 font-medium">
                <button
                  onClick={() => toggle(c.key)}
                  className="inline-flex items-center gap-1 hover:text-ink"
                >
                  {c.label}
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr
              key={p.id}
              className="border-b border-edge last:border-0 hover:bg-mist/60"
            >
              <td className="max-w-xs px-3 py-3 text-gray-700">
                {truncate(p.text, 64)}
              </td>
              <td className="px-3 py-3 text-gray-600">
                {formatDate(p.createdAt)}
              </td>
              <td className="px-3 py-3 font-medium text-ink">
                {formatNumber(p.stats!.impressions)}
              </td>
              <td className="px-3 py-3 text-gray-600">
                {p.stats!.engagementRate}%
              </td>
              <td className="px-3 py-3 text-gray-600">{p.stats!.comments}</td>
              <td className="px-3 py-3 text-gray-600">{p.stats!.shares}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
