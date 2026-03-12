"use client";

import Link from "next/link";
import { Image } from "@imagekit/next";
import { getImageUrl } from "@/lib/imagekit-url-generator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";
import type { PublicProvider } from "@/types/public/public.types";

interface ProviderCardProps {
  provider: PublicProvider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const servicesOffered = provider.servicesOffered ?? [];
  const displayServices = servicesOffered.slice(0, 3);
  const extraCount = servicesOffered.length - 3;

  const lowestPrice = servicesOffered.length
    ? Math.min(
        ...servicesOffered.map((s) => s.customPrice ?? s.service.basePrice),
      )
    : null;

  return (
    <Link href={`/providers/${provider.slug}`} className="block min-w-0">
      <Card className="border border-zinc-200 bg-white overflow-hidden h-full">
        <CardContent className="p-4 space-y-3 overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
              <Image
                src={getImageUrl(provider.profileImage, "avatar") || "/error-placeholder-image.webp"}
                alt={provider.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="font-semibold text-sm text-zinc-900 truncate">
                  {provider.user.name}
                </p>
                <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
              </div>
              {provider.experience !== null && (
                <p className="text-xs text-zinc-600 mt-0.5">
                  {provider.experience}{" "}
                  {provider.experience === 1 ? "year" : "years"} exp
                </p>
              )}
            </div>
            {lowestPrice !== null && (
              <div className="text-right shrink-0">
                <p className="text-[10px] text-zinc-500">from</p>
                <p className="font-bold text-sm text-zinc-900">
                  ₹{lowestPrice.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>

          {/* Bio */}
          {provider.bio && (
            <p className="text-xs text-zinc-600 line-clamp-2 leading-snug">
              {provider.bio}
            </p>
          )}

          {/* Services */}
          {servicesOffered.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">
                Services
              </p>
              <div className="flex flex-wrap gap-1">
                {displayServices.map((s) => (
                  <Badge
                    key={s.id}
                    variant="secondary"
                    className="text-[10px] font-medium bg-zinc-100 text-zinc-700 border-0 px-1.5 py-0"
                  >
                    {s.service.title}
                  </Badge>
                ))}
                {extraCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-medium bg-zinc-100 text-zinc-500 border-0 px-1.5 py-0"
                  >
                    +{extraCount}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* <div className="flex items-center gap-1.5 pt-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-zinc-200 fill-zinc-200"}`}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">Verified</span>
          </div> */}
        </CardContent>
      </Card>
    </Link>
  );
}
