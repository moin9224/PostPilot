"use client";

import type { Post } from "@/lib/types";
import { cn, formatTime, truncate } from "@/lib/utils";

const DOT: Record<Post["status"], string> = {
  draft: "bg-gray-400",
  scheduled: "bg-action",
  published: "bg-success",
  failed: "bg-error",
};

export default function PostCard({
  post,
  onClick,
}: {
  post: Post;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-1.5 truncate rounded px-1.5 py-1 text-left text-xs transition-colors hover:bg-mist"
      title={post.text}
    >
      <span className={cn("h-2 w-2 flex-shrink-0 rounded-full", DOT[post.status])} />
      {post.scheduledFor && (
        <span className="flex-shrink-0 font-medium text-gray-500">
          {formatTime(post.scheduledFor)}
        </span>
      )}
      <span className="truncate text-gray-700">{truncate(post.text, 22)}</span>
    </button>
  );
}
