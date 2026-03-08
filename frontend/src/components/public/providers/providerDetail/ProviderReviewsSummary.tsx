import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./StarRating";

interface ProviderReviewsSummaryProps {
  avgRating: number;
  reviewCount: number;
  reviews: { rating: number }[];
}

export function ProviderReviewsSummary({
  avgRating,
  reviewCount,
  reviews,
}: ProviderReviewsSummaryProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 flex items-center gap-6">
      <div className="text-center">
        <p className="text-5xl font-bold text-zinc-900">
          {avgRating.toFixed(1)}
        </p>
        <StarRating rating={avgRating} size="md" />
        <p className="text-xs text-zinc-400 mt-1">
          {reviewCount}{" "}
          {reviewCount === 1 ? "review" : "reviews"}
        </p>
      </div>
      <Separator orientation="vertical" className="h-16" />
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.filter((r) => r.rating === star).length;
          const pct =
            reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return (
            <div
              key={star}
              className="flex items-center gap-2 text-xs text-zinc-500"
            >
              <span className="w-3 text-right">{star}</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-4 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
