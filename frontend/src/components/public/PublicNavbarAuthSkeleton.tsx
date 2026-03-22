import { Skeleton } from "@/components/ui/skeleton";

export function PublicNavbarAuthSkeleton() {
  return (
    <div className="flex items-center gap-2 shrink-0 min-w-[168px] justify-end">
      <Skeleton className="h-8 w-[72px] rounded-lg" />
      <Skeleton className="h-8 w-[88px] rounded-lg" />
    </div>
  );
}
