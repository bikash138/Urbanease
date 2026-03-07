import { Skeleton } from "@/components/ui/skeleton";

export function CategoryGridSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-100 bg-white p-4">
      <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
