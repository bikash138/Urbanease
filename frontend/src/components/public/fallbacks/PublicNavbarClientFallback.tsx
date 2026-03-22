import { Skeleton } from "@/components/ui/skeleton";

export function PublicNavbarClientFallback() {
  return (
    <>
      <div className="flex flex-1 min-w-0 items-center gap-6">
        <div className="hidden md:flex gap-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 flex-1 md:max-w-md rounded-lg" />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="hidden md:block h-8 w-[72px] rounded-lg" />
        <Skeleton className="h-8 w-[88px] rounded-lg" />
      </div>
    </>
  );
}
