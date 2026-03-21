import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { PublicService } from "@/types/public/public.types";
import { PublicApiUnavailableMessage } from "@/components/common/PublicApiUnavailableMessage";
import { getPublicServices } from "@/server/public";
import { HomeCarousel } from "@/components/public/home/HomeCarousel";

export function ServicesSectionHeader() {
  return (
    <div className="flex items-end justify-between mb-12">
      <div className="space-y-2">
        <Badge variant="outline" className="text-zinc-500 border-zinc-300">
          Featured Services
        </Badge>
        <h2 className="text-3xl font-bold text-zinc-900">Popular right now</h2>
        <p className="text-zinc-500 max-w-md">
          Our most-booked services, trusted by thousands of happy customers
          across the city.
        </p>
      </div>
      <Link href="/categories">
        <Button
          variant="outline"
          className="hidden md:flex items-center gap-2 border-zinc-300 hover:bg-zinc-50"
        >
          View all services <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}

export default async function ServicesSection() {
  let services: PublicService[];
  try {
    await new Promise((res) => {
      setTimeout(
        res, 4000);
    });
    services = await getPublicServices();
  } catch {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ServicesSectionHeader />
          <PublicApiUnavailableMessage />
        </div>
      </section>
    );
  }

  const displayServices = services.slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ServicesSectionHeader />

        {displayServices.length > 0 ? (
          <HomeCarousel variant="services" items={displayServices} />
        ) : (
          <p className="text-sm text-zinc-500">
            No featured services to show right now.
          </p>
        )}
      </div>
    </section>
  );
}
