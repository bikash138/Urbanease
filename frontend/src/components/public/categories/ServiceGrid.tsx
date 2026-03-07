import ServiceCard, { ServiceCardSkeleton } from "./ServiceCard";
import type { PublicCategoryDetail } from "@/types/public/public.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Service = PublicCategoryDetail["services"][number];

interface ServiceGridProps {
  services: Service[];
  isLoading: boolean;
}

export default function ServiceGrid({ services, isLoading }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="py-20 text-center space-y-3 border border-zinc-100 rounded-2xl bg-white">
        <p className="font-semibold text-zinc-700">No services yet</p>
        <p className="text-sm text-zinc-400">
          Services in this category are coming soon.
        </p>
        <Link href="/categories">
          <Button variant="outline" size="sm" className="mt-2">
            Browse all categories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
