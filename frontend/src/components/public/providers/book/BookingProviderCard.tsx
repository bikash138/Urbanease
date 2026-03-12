"use client";

import { Image } from "@imagekit/next";
import { getImageUrl } from "@/lib/imagekit-url-generator";
import { Building2 } from "lucide-react";
import type { PublicProviderDetail } from "@/types/public/public.types";

interface BookingProviderCardProps {
  provider: PublicProviderDetail;
}

export function BookingProviderCard({ provider }: BookingProviderCardProps) {
  const initials = provider.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
        <Image
          src={getImageUrl(provider.profileImage, "avatar") || "/error-placeholder-image.webp"}
          alt={provider.user.name}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-zinc-900 text-sm truncate">
          {provider.user.name}
        </p>
        {provider.experience !== null && (
          <p className="text-xs text-zinc-400">
            {provider.experience}{" "}
            {provider.experience === 1 ? "year" : "years"} experience
          </p>
        )}
      </div>
      <Building2 className="w-4 h-4 text-zinc-300 ml-auto shrink-0" />
    </div>
  );
}
