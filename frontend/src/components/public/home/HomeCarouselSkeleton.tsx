"use client";

import { CategoryCardSkeleton } from "@/components/common/skeletons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/** Shared loading carousel for categories & services on the home page. */
export function HomeCarouselSkeleton() {
  return (
    <div className="relative w-full min-w-0">
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4 pr-4 md:pr-14">
          {Array.from({ length: 8 }).map((_, i) => (
            <CarouselItem
              key={i}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4"
            >
              <CategoryCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          className="left-0 border-zinc-200 bg-white hover:bg-zinc-50"
        />
        <CarouselNext
          variant="outline"
          className="right-0 border-zinc-200 bg-white hover:bg-zinc-50"
        />
      </Carousel>
    </div>
  );
}
