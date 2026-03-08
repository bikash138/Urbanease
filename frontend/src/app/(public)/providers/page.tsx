"use client";

import { useState, useMemo } from "react";
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
  Briefcase,
  Star,
  X,
  BadgeCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePublicProviders,
  usePublicServices,
} from "@/hooks/public/usePublic";
import type { PublicProvider } from "@/types/public/public.types";
import PublicNavbar from "@/components/public/PublicNavbar";

// ─── Provider Card ────────────────────────────────────────────────────────────

function ProviderCard({ provider }: { provider: PublicProvider }) {
  const initials = provider.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const servicesOffered = provider.servicesOffered ?? [];
  const displayServices = servicesOffered.slice(0, 3);
  const extraCount = servicesOffered.length - 3;

  const lowestPrice = servicesOffered.length
    ? Math.min(
        ...servicesOffered.map((s) => s.customPrice ?? s.service.basePrice),
      )
    : null;

  return (
    <Link href={`/providers/${provider.slug}`}>
      <Card className="group border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 bg-white overflow-hidden h-full">
        <div className="h-1 bg-linear-to-r from-zinc-800 via-zinc-700 to-zinc-600" />
        <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
            <Image
              src={
                provider.profileImage ??
                `https://api.dicebear.com/7.x/initials/svg?seed=${provider.user.name}`
              }
              alt={provider.user.name}
              fill
              className="object-cover"
              unoptimized={!provider.profileImage}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-zinc-900 truncate">
                {provider.user.name}
              </p>
              <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
            </div>
            {provider.experience !== null && (
              <p className="text-xs text-zinc-500 mt-0.5">
                {provider.experience}{" "}
                {provider.experience === 1 ? "year" : "years"} of experience
              </p>
            )}
          </div>
          {lowestPrice !== null && (
            <div className="text-right shrink-0">
              <p className="text-xs text-zinc-400">from</p>
              <p className="font-bold text-zinc-900">
                ₹{lowestPrice.toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        {/* Bio */}
        {provider.bio && (
          <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {provider.bio}
          </p>
        )}

        {/* Services */}
        {servicesOffered.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Services Offered
            </p>
            <div className="flex flex-wrap gap-1.5">
              {displayServices.map((s) => (
                <Badge
                  key={s.id}
                  variant="secondary"
                  className="text-xs font-normal bg-zinc-100 text-zinc-700 border-0"
                >
                  {s.service.title}
                </Badge>
              ))}
              {extraCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs font-normal bg-zinc-100 text-zinc-500 border-0"
                >
                  +{extraCount} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-zinc-200 fill-zinc-200"}`}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">Verified</span>
          </div>
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
          <Skeleton className="h-6 w-16 rounded-full" />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");

  const { data: providers, isLoading: isLoadingProviders } =
    usePublicProviders();
  const { data: services, isLoading: isLoadingServices } = usePublicServices();

  // Derive unique services offered across all providers for the filter dropdown
  const availableServices = useMemo(() => {
    if (!providers) return [];
    const map = new Map<string, string>();
    providers.forEach((p) =>
      p.servicesOffered.forEach((s) => map.set(s.service.id, s.service.title)),
    );
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [providers]);

  const filteredProviders = useMemo(() => {
    if (!providers) return [];
    return providers.filter((p) => {
      const matchesService =
        selectedServiceId === "all" ||
        p.servicesOffered.some((s) => s.service.id === selectedServiceId);

      const matchesSearch =
        !searchQuery.trim() ||
        p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.bio ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.servicesOffered.some((s) =>
          s.service.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return matchesService && matchesSearch;
    });
  }, [providers, selectedServiceId, searchQuery]);

  const hasFilters =
    selectedServiceId !== "all" || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      {/* ── PAGE HEADER ──────────────────────────────────────────────────────── */}
      <div className="pt-16 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-900">
              Our Service Providers
            </h1>
            <p className="text-zinc-500 max-w-xl">
              Browse our network of verified, experienced professionals. Filter
              by service to find the right expert for your needs.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {isLoadingProviders ? "—" : `${providers?.length ?? 0}+`}
                </p>
                <p className="text-xs text-zinc-500">Verified Providers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {isLoadingServices ? "—" : `${services?.length ?? 0}+`}
                </p>
                <p className="text-xs text-zinc-500">Services Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-zinc-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or service..."
              className="pl-9 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 h-10"
            />
          </div>

          {/* Service filter */}
          <Select
            value={selectedServiceId}
            onValueChange={setSelectedServiceId}
          >
            <SelectTrigger className="w-full sm:w-56 h-10 bg-zinc-50 border-zinc-200 focus:ring-zinc-900">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {availableServices.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-zinc-200 shrink-0"
              onClick={() => {
                setSearchQuery("");
                setSelectedServiceId("all");
              }}
            >
              <X className="w-4 h-4 mr-1.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* ── PROVIDER GRID ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Result count */}
        <p className="text-sm text-zinc-500">
          {isLoadingProviders ? (
            <Skeleton className="h-4 w-32 inline-block" />
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-zinc-900">
                {filteredProviders.length}
              </span>{" "}
              provider{filteredProviders.length !== 1 ? "s" : ""}
              {hasFilters && " matching your filters"}
            </>
          )}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoadingProviders ? (
            Array.from({ length: 9 }).map((_, i) => (
              <ProviderCardSkeleton key={i} />
            ))
          ) : filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7 text-zinc-400" />
              </div>
              <p className="font-medium text-zinc-700">No providers found</p>
              <p className="text-sm text-zinc-400">
                {hasFilters
                  ? "No providers match your current filters. Try adjusting your search."
                  : "No approved providers available yet. Check back soon!"}
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedServiceId("all");
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── BECOME A PROVIDER CTA ────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-zinc-100 mt-6">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mx-auto">
            <BadgeCheck className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">
              Are you a service professional?
            </h2>
            <p className="text-zinc-500 max-w-md mx-auto">
              Join Urbanease as a provider and connect with thousands of
              customers in your city. Grow your business with us.
            </p>
          </div>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-8"
            >
              Join as a Provider
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-zinc-200 py-10">
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
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Support"].map((item) => (
                <span
                  key={item}
                  className="text-zinc-600 text-sm hover:text-zinc-900 cursor-pointer transition-colors"
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
