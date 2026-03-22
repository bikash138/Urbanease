import type { ReactNode } from "react";
import { HomeCarouselSkeleton } from "@/components/public/home/HomeCarouselSkeleton";
import { cn } from "@/lib/utils";

type HomeSectionFallbackProps = {
  header: ReactNode;
  className?: string;
};

export function HomeSectionFallback({
  header,
  className,
}: HomeSectionFallbackProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="max-w-7xl mx-auto px-6">
        {header}
        <HomeCarouselSkeleton />
      </div>
    </section>
  );
}
