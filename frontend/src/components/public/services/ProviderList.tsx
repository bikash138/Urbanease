import { Skeleton } from "@/components/ui/skeleton";
import ProviderCard from "./ProviderCard";
import type { PublicServiceDetail } from "@/types/public/public.types";

interface ProviderListProps {
  service: PublicServiceDetail | null | undefined;
  isLoading: boolean;
}

function ProviderCardSkeleton() {
  return (
    <div className="bg-white flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
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
  isLoading,
}: ProviderListProps) {
  const providers = service?.providers ?? [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden divide-y divide-zinc-200 py-4 sm:py-6 px-4 sm:px-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 sm:p-5">
            <ProviderCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 py-20 px-4 sm:px-5 text-center space-y-2 bg-white">
        <p className="font-semibold text-zinc-700">No providers yet</p>
        <p className="text-sm text-zinc-400">
          No approved providers are offering this service right now.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden py-4 sm:py-6 px-4 sm:px-5">
      <div className="divide-y divide-zinc-200">
        {providers.map((entry) => {
          const { averageRating, reviewCount } = entry.provider;
          const avgRating =
            averageRating != null && reviewCount > 0 ? averageRating : null;

          return (
            <div key={entry.id} className="py-4 first:pt-0">
              <ProviderCard
                entry={entry}
                basePrice={service!.basePrice}
                avgRating={avgRating}
                reviewCount={reviewCount}
                serviceSlug={service!.slug}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
