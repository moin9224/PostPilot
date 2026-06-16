"use client";

import { Calendar, Eye, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/Common/Button";
import StatusBadge from "@/components/Common/StatusBadge";
import type { Post } from "@/lib/types";
import { formatDate, formatNumber, truncate } from "@/lib/utils";

export default function PostItem({
  post,
  onDelete,
  onEdit,
  onSchedule,
}: {
  post: Post;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onSchedule?: (id: string) => void;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-edge bg-white p-4 shadow-card transition-shadow hover:shadow-lift">
      <div className="mb-2 flex items-center justify-between">
        <StatusBadge status={post.status} />
        <span className="text-xs text-gray-400">
          {formatDate(post.createdAt)}
        </span>
      </div>

      <p className="flex-1 text-sm text-gray-700">{truncate(post.text, 140)}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.hashtags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand"
          >
            {tag}
          </span>
        ))}
      </div>

      {post.stats && (
        <p className="mt-3 text-xs text-gray-500">
          {formatNumber(post.stats.impressions)} impressions ·{" "}
          {post.stats.engagementRate}% engagement
        </p>
      )}

      <div className="mt-4 flex gap-2 border-t border-edge pt-3">
        <Button size="sm" variant="ghost" className="flex-1" onClick={() => onEdit?.(post.id)}>
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
        <Button size="sm" variant="ghost" className="flex-1" onClick={() => onSchedule?.(post.id)}>
          {post.status === "published" ? (
            <>
              <Eye className="h-3.5 w-3.5" /> View
            </>
          ) : (
            <>
              <Calendar className="h-3.5 w-3.5" /> Schedule
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-error hover:bg-red-50"
          onClick={() => onDelete(post.id)}
          aria-label="Delete post"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  );
}
