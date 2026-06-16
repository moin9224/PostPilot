import { Heart, MessageCircle } from "lucide-react";
import type { CompetitorPost } from "@/lib/types";
import { formatCompact, formatDate } from "@/lib/utils";

export default function CompetitorPosts({
  posts,
}: {
  posts: CompetitorPost[];
}) {
  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <article
          key={p.id}
          className="rounded-lg border border-edge bg-white p-4 shadow-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">
              {p.competitorName}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(p.postedAt)}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700">{p.text}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {formatCompact(p.likes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> {formatCompact(p.comments)}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
