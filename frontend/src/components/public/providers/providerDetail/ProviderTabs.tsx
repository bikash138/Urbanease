"use client";

import { MessageSquare, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProviderServiceCard } from "./ProviderServiceCard";
import { ProviderReviewCard } from "./ProviderReviewCard";
import { ProviderReviewsSummary } from "./ProviderReviewsSummary";
import type { PublicProviderDetail } from "@/types/public/public.types";

interface ProviderTabsProps {
  provider: PublicProviderDetail;
  avgRating: number | null;
}

export function ProviderTabs({ provider, avgRating }: ProviderTabsProps) {
  const reviews = provider.reviewsGained ?? [];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="services">
        <TabsList className="mb-6 bg-white border border-zinc-200 rounded-xl p-1">
          <TabsTrigger value="services" className="rounded-lg">
            Services ({provider.servicesOffered.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg">
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          {provider.servicesOffered.length === 0 ? (
            <div className="py-16 text-center space-y-3 border border-zinc-200 rounded-xl bg-white">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="font-medium text-zinc-700">No services listed</p>
              <p className="text-sm text-zinc-400">
                This provider hasn&apos;t listed any services yet.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {provider.servicesOffered.map((entry) => (
                <ProviderServiceCard
                  key={entry.id}
                  entry={entry}
                  providerSlug={provider.slug}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          {reviews.length === 0 ? (
            <div className="py-16 text-center space-y-3 border border-zinc-200 rounded-xl bg-white">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="font-medium text-zinc-700">No reviews yet</p>
              <p className="text-sm text-zinc-400">
                Be the first to book and leave a review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {avgRating !== null && (
                <ProviderReviewsSummary
                  avgRating={avgRating}
                  reviewCount={reviews.length}
                  reviews={reviews}
                />
              )}
              {reviews.map((review) => (
                <ProviderReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
