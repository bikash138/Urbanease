import Image from "next/image";
import { Grid3X3, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryBannerProps {
  categoryCount: number;
  serviceCount: number;
  isLoading: boolean;
}

export function CategoryBanner({
  categoryCount,
  serviceCount,
  isLoading,
}: CategoryBannerProps) {
  return (
    <div className=" rounded-2xl p-6 flex flex-col gap-5">
      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-zinc-900">All Categories</h1>
        <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
          Browse our full range of home and urban service categories. Click any
          category to explore available services.
        </p>
      </div>

      <div className="relative flex-1 rounded-xl bg-zinc-100 overflow-hidden min-h-52">
        <Image
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2940&auto=format&fit=crop"
          alt="Categories banner"
          fill
          className="object-cover"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex-1 min-w-0">
          <Grid3X3 className="w-4 h-4 text-zinc-400 shrink-0" />
          {isLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <span className="text-sm text-zinc-500 truncate">
              <span className="font-semibold text-zinc-800">
                {categoryCount}
              </span>{" "}
              categories
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex-1 min-w-0">
          <Wrench className="w-4 h-4 text-zinc-400 shrink-0" />
          {isLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <span className="text-sm text-zinc-500 truncate">
              <span className="font-semibold text-zinc-800">
                {serviceCount}
              </span>{" "}
              services
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
