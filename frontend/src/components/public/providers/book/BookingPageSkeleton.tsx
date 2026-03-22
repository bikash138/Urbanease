import { Skeleton } from "@/components/ui/skeleton";

export function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="pt-28 max-w-5xl mx-auto px-6 space-y-4">
        <Skeleton className="h-6 w-56" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
