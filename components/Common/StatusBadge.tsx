import type { PostStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<PostStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  scheduled: "bg-blue-50 text-action ring-blue-100",
  published: "bg-emerald-50 text-success ring-emerald-100",
  failed: "bg-red-50 text-error ring-red-100",
};

const LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  failed: "Failed",
};

const DOTS: Record<PostStatus, string> = {
  draft: "bg-neutral-400",
  scheduled: "bg-action",
  published: "bg-success",
  failed: "bg-error",
};

export default function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        STYLES[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOTS[status])} />
      {LABELS[status]}
    </span>
  );
}
