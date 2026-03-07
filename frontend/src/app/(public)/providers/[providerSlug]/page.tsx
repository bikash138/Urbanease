"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Star,
  BadgeCheck,
  IndianRupee,
  Briefcase,
  Phone,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePublicProviderDetail } from "@/hooks/public/usePublic";
import { useAuthStore } from "@/store/auth.store";
import PublicNavbar from "@/components/public/PublicNavbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const sz = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sz} ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-200"
          }`}
        />
      ))}
    </div>
  );
}

function formatReviewDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProviderProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-white border-b border-zinc-100 pt-16">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex gap-6 items-start">
            <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-56" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6">
        <Skeleton className="h-10 w-full rounded-lg max-w-md" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProviderProfilePage({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  const { providerSlug } = use(params);
  const { isAuthenticated, role } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: provider, isLoading } = usePublicProviderDetail(providerSlug);

  // Derived stats
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

  const bookHref =
    mounted && isAuthenticated && role === "CUSTOMER"
      ? `/providers/${providerSlug}/book`
      : "/auth/signin";

  if (isLoading) return <ProviderProfileSkeleton />;

  if (!provider) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <PublicNavbar />
        <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-zinc-400" />
          </div>
          <p className="font-semibold text-zinc-900">Provider not found</p>
          <p className="text-sm text-zinc-400">
            This provider profile doesn&apos;t exist or has been removed.
          </p>
          <Link href="/providers">
            <Button variant="outline" size="sm">
              Browse Providers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = getInitials(provider.user.name);

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      {/* ── HERO / PROFILE HEADER ───────────────────────────────────────────── */}
      <div className="pt-16 bg-white border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/providers"
              className="hover:text-zinc-900 transition-colors"
            >
              Providers
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-900 font-medium">
              {provider.user.name}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg">
              {initials}
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
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
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
                    <Sparkles className="w-3.5 h-3.5" />
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
              <p className="text-xs text-zinc-400 text-center">
                {mounted && isAuthenticated && role === "CUSTOMER"
                  ? "Select a slot to get started"
                  : "Free signup · No commitment"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="services">
          <TabsList className="mb-6 bg-white border border-zinc-200 rounded-xl p-1">
            <TabsTrigger value="services" className="rounded-lg">
              Services ({provider.servicesOffered.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          {/* ── SERVICES TAB ─────────────────────────────────────────────── */}
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
                {provider.servicesOffered.map((entry) => {
                  const price = entry.customPrice ?? entry.service.basePrice;
                  return (
                    <Link
                      key={entry.id}
                      href={`/services/${entry.service.slug}`}
                      className="group block"
                    >
                      <div className="rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className="h-1 bg-linear-to-r from-zinc-800 via-zinc-700 to-zinc-600" />
                        <div className="p-5 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors truncate">
                              {entry.service.title}
                            </p>
                            {entry.customPrice !== null && (
                              <Badge
                                variant="secondary"
                                className="mt-1 text-xs bg-amber-50 text-amber-700 border-amber-200 border"
                              >
                                Custom pricing
                              </Badge>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-zinc-400">Price</p>
                            <div className="flex items-center gap-0.5 justify-end">
                              <IndianRupee className="w-3.5 h-3.5 text-zinc-900" />
                              <span className="font-bold text-zinc-900">
                                {price.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ── REVIEWS TAB ──────────────────────────────────────────────── */}
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
                {/* Summary banner */}
                {avgRating !== null && (
                  <div className="rounded-xl border border-zinc-200 bg-white p-5 flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-zinc-900">
                        {avgRating.toFixed(1)}
                      </p>
                      <StarRating rating={avgRating} size="md" />
                      <p className="text-xs text-zinc-400 mt-1">
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(
                          (r) => r.rating === star,
                        ).length;
                        const pct =
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;
                        return (
                          <div
                            key={star}
                            className="flex items-center gap-2 text-xs text-zinc-500"
                          >
                            <span className="w-3 text-right">{star}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-4 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Review cards */}
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-700">
                          {getInitials(review.customer.name)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 text-sm">
                            {review.customer.name}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {formatReviewDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-zinc-900 mt-10">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Ready to book {provider.user.name}?
          </h2>
          <p className="text-zinc-400">
            {mounted && isAuthenticated && role === "CUSTOMER"
              ? "Choose a slot and confirm your booking in minutes."
              : "Create a free account to book, track and review services."}
          </p>
          <Link href={bookHref}>
            <Button
              size="lg"
              className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-xl px-8"
            >
              {mounted && isAuthenticated && role === "CUSTOMER"
                ? "Book Now"
                : "Get Started — It's Free"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-zinc-950 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-semibold">Urbanease</span>
            </div>
            <p className="text-zinc-600 text-sm">
              © 2026 Urbanease. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Support"].map((item) => (
                <span
                  key={item}
                  className="text-zinc-600 text-sm hover:text-zinc-400 cursor-pointer transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
