import { Skeleton } from "@/components/ui/skeleton";

function ProviderRowSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border border-zinc-100 rounded-xl bg-white">
      <Skeleton className="w-full sm:w-28 aspect-video sm:aspect-auto sm:h-24 rounded-xl shrink-0 order-1 sm:order-2" />
      <div className="flex-1 space-y-2 order-2 sm:order-1 min-w-0">
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

export function ServiceDetailPageFallback() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
            <aside className="hidden lg:flex w-[300px] shrink-0 flex-col h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 border-r border-zinc-100 bg-white">
              <div className="p-6 space-y-7">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="aspect-video col-span-2 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pl-8">
              <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-zinc-100 py-4 space-y-3">
                <Skeleton className="h-20 w-full max-w-md" />
                <div className="flex gap-2 overflow-x-auto pb-1 overscroll-x-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
                  ))}
                </div>
              </div>

              <div className="py-6 sm:py-8 space-y-4">
                <Skeleton className="h-4 w-2/3 max-w-md" />
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProviderRowSkeleton key={i} />
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
