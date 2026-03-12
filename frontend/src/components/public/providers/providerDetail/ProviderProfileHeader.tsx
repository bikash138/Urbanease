"use client";

import { Image } from "@imagekit/next";
import { getImageUrl } from "@/lib/imagekit-url-generator";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  IndianRupee,
  Briefcase,
  Phone,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import type { PublicProviderDetail } from "@/types/public/public.types";

interface ProviderProfileHeaderProps {
  provider: PublicProviderDetail;
  avgRating: number | null;
  reviewCount: number;
  lowestPrice: number | null;
  bookHref: string;
  bookCtaText: string;
}

export function ProviderProfileHeader({
  provider,
  avgRating,
  reviewCount,
  lowestPrice,
  bookHref,
  bookCtaText,
}: ProviderProfileHeaderProps) {
  return (
    <div className="pt-16 bg-white border-b border-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg bg-zinc-100">
            <Image
              src={getImageUrl(provider.profileImage, "avatar") || "/error-placeholder-image.webp"}
              alt={provider.user.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-zinc-900">
                {provider.user.name}
              </h1>
              <BadgeCheck className="w-5 h-5 text-blue-500" />
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-200 border"
              >
                Verified
              </Badge>
            </div>

            {avgRating !== null && (
              <div className="flex items-center gap-2">
                <StarRating rating={avgRating} size="md" />
                <span className="text-sm font-semibold text-zinc-800">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-zinc-500">
                  ({reviewCount}{" "}
                  {reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-zinc-500 flex-wrap">
              {provider.experience !== null && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {provider.experience}{" "}
                  {provider.experience === 1 ? "year" : "years"} experience
                </span>
              )}
              {provider.user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {provider.user.phone}
                </span>
              )}
              {provider.servicesOffered.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  {provider.servicesOffered.length}{" "}
                  {provider.servicesOffered.length === 1
                    ? "service"
                    : "services"}{" "}
                  offered
                </span>
              )}
            </div>

            {provider.bio && (
              <p className="text-sm text-zinc-600 leading-relaxed max-w-xl pt-1">
                {provider.bio}
              </p>
            )}
          </div>

          {/* Quick book card */}
          <div className="sm:w-56 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            {lowestPrice !== null && (
              <div>
                <p className="text-xs text-zinc-400">Starting from</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <IndianRupee className="w-4 h-4 text-zinc-900" />
                  <span className="text-2xl font-bold text-zinc-900">
                    {lowestPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}
            <Link href={bookHref} className="block">
              <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg">
                Book Now
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <p className="text-xs text-zinc-400 text-center">{bookCtaText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
