"use client";

import { use } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import ServiceSidebar from "@/components/public/services/ServiceSidebar";
import ProviderList from "@/components/public/services/ProviderList";
import {
  usePublicServiceDetail,
  usePublicServices,
  usePublicReviews,
} from "@/hooks/public/usePublic";

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  const { serviceSlug } = use(params);

  const { data: service, isLoading: isLoadingService } =
    usePublicServiceDetail(serviceSlug);
  const { data: allReviews = [] } = usePublicReviews();
  const { data: relatedServicesRaw = [], isLoading: isLoadingRelated } =
    usePublicServices(service?.category?.slug);

  const relatedServices = relatedServicesRaw
    .filter((s) => s.slug !== serviceSlug)
    .slice(0, 9);

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      <div className="pt-16 w-full px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row">
          {/*left sidebar (desktop only) */}
          <ServiceSidebar
            service={service}
            relatedServices={relatedServices}
            isLoadingService={isLoadingService}
            isLoadingRelated={isLoadingRelated}
            currentSlug={serviceSlug}
          />

        {/* Scrollable right content */}
        <main className="flex-1 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-zinc-100 px-4 py-4 space-y-3">
            {isLoadingService ? (
              <div className="h-20" />
            ) : service ? (
              <>
                <div>
                  <h1 className="text-lg font-bold text-zinc-900">
                    {service.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                    <span>
                      {service.providers.length}{" "}
                      {service.providers.length === 1 ? "provider" : "providers"}
                    </span>
                    <span>₹{service.basePrice.toLocaleString("en-IN")}</span>
                    {service.category && (
                      <span>{service.category.name}</span>
                    )}
                  </div>
                </div>
                {relatedServices.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
                    {relatedServices.map((s) => {
                      const isActive = s.slug === serviceSlug;
                      return (
                        <Link
                          key={s.id}
                          href={`/services/${s.slug}`}
                          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            isActive
                              ? "bg-zinc-900 text-white border-zinc-900"
                              : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                          }`}
                        >
                          {s.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : null}
          </div>

          <div className="max-w-3xl mx-4 sm:px-6 py-6 space-y-4">
            {!isLoadingService && service && (
              <p className="text-sm text-zinc-500">
                <span className="font-semibold text-zinc-900">
                  {service.providers.length}
                </span>{" "}
                {service.providers.length === 1 ? "provider" : "providers"}{" "}
                offering{" "}
                <span className="font-medium text-zinc-700">
                  {service.title}
                </span>
              </p>
            )}

            <ProviderList
              service={service}
              reviews={allReviews}
              isLoading={isLoadingService}
            />
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}
