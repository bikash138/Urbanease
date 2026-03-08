"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  usePublicProviders,
  usePublicServices,
} from "@/hooks/public/usePublic";
import PublicNavbar from "@/components/public/PublicNavbar";
import CTABanner from "@/components/common/CTABanner";
import Footer from "@/components/common/Footer";
import { ProviderBanner } from "@/components/public/providers/ProviderBanner";
import { ProviderGrid } from "@/components/public/providers/ProviderGrid";

export default function ProvidersPage() {
  const { data: providers, isLoading: isLoadingProviders } =
    usePublicProviders();
  const { data: services, isLoading: isLoadingServices } = usePublicServices();

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start">
            <ProviderBanner
              providerCount={providers?.length ?? 0}
              serviceCount={services?.length ?? 0}
              isLoadingProviders={isLoadingProviders}
              isLoadingServices={isLoadingServices}
            />
            <ProviderGrid
              providers={providers ?? []}
              isLoading={isLoadingProviders}
            />
          </div>
        </div>
      </main>

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

      <CTABanner />
      <Footer />
    </div>
  );
}
