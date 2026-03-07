import { Skeleton } from "@/components/ui/skeleton";
import ProviderCard from "./ProviderCard";
import type { PublicServiceDetail, PublicReview } from "@/types/public/public.types";

interface ProviderListProps {
  service: PublicServiceDetail | null | undefined;
  reviews: PublicReview[];
  isLoading: boolean;
}

function buildRatingMap(reviews: PublicReview[]) {
  const map = new Map<string, { total: number; count: number }>();
  reviews.forEach((review) => {
    const pid = review.provider.id;
    const existing = map.get(pid) ?? { total: 0, count: 0 };
    map.set(pid, {
      total: existing.total + review.rating,
      count: existing.count + 1,
    });
  });
  return map;
}

function ProviderCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
      <Skeleton className="w-full sm:w-28 aspect-video sm:aspect-auto sm:h-24 rounded-xl shrink-0 order-1 sm:order-2" />
      <div className="flex-1 space-y-3 order-2 sm:order-1">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-3.5 w-1/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export default function ProviderList({
  service,
  reviews,
  isLoading,
}: ProviderListProps) {
  const ratingMap = buildRatingMap(reviews);
  const providers = service?.providers ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProviderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="py-20 text-center space-y-2 border border-zinc-100 rounded-2xl bg-white">
        <p className="font-semibold text-zinc-700">No providers yet</p>
        <p className="text-sm text-zinc-400">
          No approved providers are offering this service right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {providers.map((entry) => {
        const ratingData = ratingMap.get(entry.provider.id);
        const avgRating = ratingData
          ? ratingData.total / ratingData.count
          : null;
        const reviewCount = ratingData?.count ?? 0;

        return (
          <ProviderCard
            key={entry.id}
            entry={entry}
            basePrice={service!.basePrice}
            avgRating={avgRating}
            reviewCount={reviewCount}
          />
        );
      })}
    </div>
  );
}
