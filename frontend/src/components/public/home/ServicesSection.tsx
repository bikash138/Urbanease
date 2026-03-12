"use client";

import { Image } from "@imagekit/next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { PublicService } from "@/types/public/public.types";

function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-zinc-100">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: PublicService }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <div className="group overflow-hidden rounded-2xl bg-white transition-all duration-200">
        <div className="relative w-full aspect-square bg-zinc-100">
          <Image
            src={service.image || "/error-placeholder-image.webp"}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        </div>
        <div className="px-3 py-3 space-y-2.5">
          <p className="text-sm font-medium text-zinc-900 leading-snug">
            {service.title}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400">Starting at</span>
              <p className="text-base font-bold text-zinc-900">
                ₹{service.basePrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ServicesSectionProps {
  isLoadingServices: boolean;
  displayServices: PublicService[];
}

export default function ServicesSection({
  isLoadingServices,
  displayServices,
}: ServicesSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <Badge variant="outline" className="text-zinc-500 border-zinc-300">
              Featured Services
            </Badge>
            <h2 className="text-3xl font-bold text-zinc-900">
              Popular right now
            </h2>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoadingServices
            ? Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            : displayServices.length > 0
              ? displayServices.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))
              : Array.from({ length: 8 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))}
        </div>
      </div>
    </section>
  );
}
