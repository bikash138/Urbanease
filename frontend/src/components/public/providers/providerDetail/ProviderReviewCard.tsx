import { StarRating } from "./StarRating";
import { formatReviewDate, getInitials } from "./utils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  customer: { name: string };
  createdAt: string;
}

interface ProviderReviewCardProps {
  review: Review;
}

export function ProviderReviewCard({ review }: ProviderReviewCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-700">
            {getInitials(review.customer.name)}
          </div>
          <div>
            <p className="font-medium text-zinc-900 text-sm">
              {review.customer.name}
            </p>
            <p className="text-xs text-zinc-400">
              {formatReviewDate(review.createdAt)}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="text-sm text-zinc-600 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}
