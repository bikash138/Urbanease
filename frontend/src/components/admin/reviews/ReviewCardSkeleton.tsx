import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ReviewCardSkeleton() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-3">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Separator />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
