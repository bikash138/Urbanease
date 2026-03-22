import { Skeleton } from "@/components/ui/skeleton";

export function ProviderProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="space-y-8">
        <div className="bg-white border-b border-zinc-100 pt-16">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex gap-6 items-start">
              <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-4 w-56" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-full rounded-lg max-w-md" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
