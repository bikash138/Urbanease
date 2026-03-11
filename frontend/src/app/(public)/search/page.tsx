"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ArrowRight,
  Building2,
  Users,
  BadgeCheck,
} from "lucide-react";
import { usePublicSearch } from "@/hooks/public/usePublic";
import type { PublicSearchResult } from "@/types/public/public.types";
import PublicNavbar from "@/components/public/PublicNavbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchResultCard({ result }: { result: PublicSearchResult }) {
  const price = result.customPrice ?? result.service.basePrice;
  const providerName = result.provider.user.name;

  return (
    <Link href={`/providers/${result.provider.slug}`}>
      <Card className="group border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 bg-white overflow-hidden h-full">
        <div className="h-1 bg-linear-to-r from-zinc-800 via-zinc-700 to-zinc-600" />
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
              <Image
                src={
                  result.provider.profileImage ??
                  `https://api.dicebear.com/7.x/initials/svg?seed=${providerName}`
                }
                alt={providerName}
                fill
                className="object-cover"
                unoptimized={!result.provider.profileImage}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-zinc-900 truncate">
                  {providerName}
                </p>
                <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
              </div>
              <Badge
                variant="secondary"
                className="text-xs font-normal bg-zinc-100 text-zinc-700 border-0 mt-1"
              >
                {result.service.title}
              </Badge>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-zinc-400">from</p>
              <p className="font-bold text-zinc-900">
                ₹{price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Verified</span>
            <Button
              size="sm"
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg"
              asChild
            >
              <span className="flex items-center gap-1">
                View Profile
                <ArrowRight className="w-3 h-3" />
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProviderCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="h-1 bg-zinc-100" />
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Separator />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceParam = searchParams.get("service") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const cityParam = searchParams.get("city") ?? "";
  const [localQuery, setLocalQuery] = useState(
    () => serviceParam || categoryParam || cityParam,
  );

  const service = searchParams.get("service") ?? "";
  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";

  const hasFilters = !!service || !!category || !!city;

  const searchParamsObj = {
    service: service || undefined,
    category: category || undefined,
    city: city || undefined,
  };

  const { data: results, isLoading } = usePublicSearch(searchParamsObj);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = localQuery.trim();
    if (!q) return;
    const params = new URLSearchParams();
    params.set("service", q);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      <div className="pt-16 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900">
              Search Providers
            </h1>
            <p className="text-zinc-500 max-w-xl">
              Find verified service providers by service, category, or city.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                value={localQuery || service || category || city}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search by service, category, or city..."
                className="pl-9 h-11 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-900"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-900 hover:bg-zinc-800"
              >
                Search
              </Button>
            </div>
          </form>

          {hasFilters && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Filters:</span>
              {service && (
                <Badge variant="secondary" className="font-normal">
                  Service: {service}
                </Badge>
              )}
              {category && (
                <Badge variant="secondary" className="font-normal">
                  Category: {category}
                </Badge>
              )}
              {city && (
                <Badge variant="secondary" className="font-normal">
                  City: {city}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {!hasFilters ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
              <Search className="w-7 h-7 text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-700">Start your search</p>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Enter a service name (e.g. &quot;ac&quot;, &quot;plumbing&quot;),
              category, or city to find providers in your area.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-500">
              {isLoading ? (
                <Skeleton className="h-4 w-32 inline-block" />
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-zinc-900">
                    {results?.length ?? 0}
                  </span>{" "}
                  result{(results?.length ?? 0) !== 1 ? "s" : ""} matching your
                  search
                </>
              )}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <ProviderCardSkeleton key={i} />
                ))
              ) : results && results.length > 0 ? (
                results.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
                    <Users className="w-7 h-7 text-zinc-400" />
                  </div>
                  <p className="font-medium text-zinc-700">
                    No providers found
                  </p>
                  <p className="text-sm text-zinc-400">
                    Try adjusting your search terms or browse all{" "}
                    <Link
                      href="/providers"
                      className="text-zinc-900 underline hover:no-underline"
                    >
                      providers
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <footer className="bg-white border-t border-zinc-200 py-10 mt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-200 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-zinc-700" />
              </div>
              <span className="text-zinc-900 font-semibold">Urbanease</span>
            </div>
            <p className="text-zinc-600 text-sm">
              © 2026 Urbanease. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SearchPageFallback() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />
      <div className="pt-16 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-11 w-full max-w-xl" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Skeleton className="h-4 w-32" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
