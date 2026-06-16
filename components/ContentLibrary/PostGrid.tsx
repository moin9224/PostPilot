import { FileText } from "lucide-react";
import PostItem from "./PostItem";
import type { Post } from "@/lib/types";

export default function PostGrid({
  posts,
  onDelete,
  onEdit,
  onSchedule,
}: {
  posts: Post[];
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  onSchedule?: (id: string) => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-edge bg-white py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-gray-400">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-semibold text-ink">No posts found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters or generate new content.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostItem key={p.id} post={p} onDelete={onDelete} onEdit={onEdit} onSchedule={onSchedule} />
      ))}
    </div>
  );
}
