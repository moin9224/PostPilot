import { Sparkles } from "lucide-react";
import type { Recommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

const IMPACT: Record<Recommendation["impact"], string> = {
  High: "bg-green-50 text-success",
  Medium: "bg-amber-50 text-warning",
  Low: "bg-mist text-gray-500",
};

export default function RecommendationPanel({
  recommendations,
}: {
  recommendations: Recommendation[];
}) {
  return (
    <div className="rounded-lg border border-edge bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand" />
        <h3 className="font-semibold text-ink">Recommendations</h3>
      </div>
      <ul className="space-y-3">
        {recommendations.map((r) => (
          <li key={r.id} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                IMPACT[r.impact],
              )}
            >
              {r.impact}
            </span>
            <p className="text-sm text-gray-700">{r.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
