"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BookingCollapsibleSkeleton() {
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}
