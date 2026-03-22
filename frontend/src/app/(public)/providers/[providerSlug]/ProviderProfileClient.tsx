"use client";

import { useEffect, useState } from "react";
import { usePublicProviderDetail } from "@/hooks/public/usePublic";
import { useAuthStore } from "@/store/auth.store";
import { ProviderProfileHeader } from "@/components/public/providers/providerDetail/ProviderProfileHeader";
import { ProviderProfileSkeleton } from "@/components/public/providers/providerDetail/ProviderProfileSkeleton";
import { ProviderNotFound } from "@/components/public/providers/providerDetail/ProviderNotFound";
import { ProviderTabs } from "@/components/public/providers/providerDetail/ProviderTabs";
import { ProviderCTA } from "@/components/public/providers/providerDetail/ProviderCTA";
import type { PublicProviderDetail } from "@/types/public/public.types";

export default function ProviderProfileClient({
  providerSlug,
  initialProvider,
}: {
  providerSlug: string;
  initialProvider: PublicProviderDetail | null;
}) {
  const { isAuthenticated, role } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  const { data: provider, isLoading } = usePublicProviderDetail(providerSlug, {
    initialData: initialProvider,
  });

  const reviews = provider?.reviewsGained ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const lowestPrice = provider?.servicesOffered.length
    ? Math.min(
        ...provider.servicesOffered.map(
          (s) => s.customPrice ?? s.service.basePrice,
        ),
      )
    : null;

  const defaultServiceSlug =
    provider?.servicesOffered.length && lowestPrice !== null
      ? provider.servicesOffered.find(
          (s) => (s.customPrice ?? s.service.basePrice) === lowestPrice,
        )?.service.slug
      : null;

  const bookBase = `/providers/${providerSlug}/book`;
  const serviceQuery = defaultServiceSlug
    ? `?service=${encodeURIComponent(defaultServiceSlug)}`
    : "";
  const fullBookPath = `${bookBase}${serviceQuery}`;

  const bookHref =
    mounted && isAuthenticated && role === "CUSTOMER"
      ? fullBookPath
      : `/auth/signin?callbackUrl=${encodeURIComponent(fullBookPath)}`;

  const bookCtaText =
    mounted && isAuthenticated && role === "CUSTOMER"
      ? "Select a slot to get started"
      : "Free signup · No commitment";

  const ctaSubtext =
    mounted && isAuthenticated && role === "CUSTOMER"
      ? "Choose a slot and confirm your booking in minutes."
      : "Create a free account to book, track and review services.";

  const ctaButtonText =
    mounted && isAuthenticated && role === "CUSTOMER"
      ? "Book Now"
      : "Get Started — It's Free";

  if (isLoading) return <ProviderProfileSkeleton />;

  if (!provider) return <ProviderNotFound />;

  return (
    <div className="min-h-screen bg-white">
      <ProviderProfileHeader
        provider={provider}
        avgRating={avgRating}
        reviewCount={reviews.length}
        lowestPrice={lowestPrice}
        bookHref={bookHref}
        bookCtaText={bookCtaText}
      />

      <ProviderTabs provider={provider} avgRating={avgRating} />

      <ProviderCTA
        providerName={provider.user.name}
        bookHref={bookHref}
        subtext={ctaSubtext}
        buttonText={ctaButtonText}
      />
    </div>
  );
}
