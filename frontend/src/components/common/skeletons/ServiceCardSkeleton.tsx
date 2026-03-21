import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden bg-white border border-zinc-100 ${className ?? ""}`}
    >
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
