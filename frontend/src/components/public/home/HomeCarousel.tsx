import Link from "next/link";
import type { PublicCategory, PublicService } from "@/types/public/public.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CategoryCard } from "@/components/public/home/HomeCategoryCard";
import { HomeServiceCard } from "@/components/public/home/HomeServiceCard";

const slideClass = "basis-1/2 sm:basis-1/3 md:basis-1/4";

export type HomeCarouselProps =
  | { variant: "categories"; items: PublicCategory[] }
  | { variant: "services"; items: PublicService[] };

export function HomeCarousel(props: HomeCarouselProps) {
  if (props.items.length === 0) return null;

  return (
    <div className="relative w-full min-w-0">
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4 pr-4 md:pr-14">
          {props.variant === "categories"
            ? props.items.map((cat) => (
                <CarouselItem key={cat.id} className={slideClass}>
                  <Link href={`/categories/${cat.slug}`} className="block">
                    <CategoryCard category={cat} />
                  </Link>
                </CarouselItem>
              ))
            : props.items.map((service) => (
                <CarouselItem key={service.slug} className={slideClass}>
                  <HomeServiceCard service={service} className="block" />
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
