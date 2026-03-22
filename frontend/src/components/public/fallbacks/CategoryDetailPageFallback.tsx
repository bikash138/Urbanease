import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCardSkeleton } from "@/components/public/categories/ServiceCard";

export function CategoryDetailPageFallback() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
            <aside className="hidden lg:flex w-[280px] shrink-0 flex-col h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 border-r border-zinc-100 bg-white">
              <div className="p-6 space-y-7">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="w-full aspect-video rounded-xl" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pl-8">
              <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-zinc-100 py-3 flex gap-2 overflow-x-auto">
                <Skeleton className="h-8 w-14 shrink-0 rounded-full" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
                ))}
              </div>

              <div className="py-6 sm:py-8 space-y-5">
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
