import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden bg-white border border-zinc-100 ${className ?? ""}`}
    >
      <Skeleton className="w-full aspect-square" />
      <div className="p-3">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
