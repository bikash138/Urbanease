"use client";

import Link from "next/link";
import ServiceSidebar from "@/components/public/services/ServiceSidebar";
import ProviderList from "@/components/public/services/ProviderList";
import {
  usePublicServiceDetail,
  usePublicServices,
} from "@/hooks/public/usePublic";
import type { PublicService, PublicServiceDetail } from "@/types/public/public.types";

export default function ServiceDetailClient({
  serviceSlug,
  initialService,
  initialRelatedServices,
}: {
  serviceSlug: string;
  initialService: PublicServiceDetail | null;
  initialRelatedServices: PublicService[];
}) {
  const { data: service, isLoading: isLoadingService } =
    usePublicServiceDetail(serviceSlug, { initialData: initialService });

  const categorySlug = service?.category?.slug;
  const { data: relatedServicesRaw = [], isLoading: isLoadingRelated } =
    usePublicServices(categorySlug, {
      enabled: !!categorySlug,
      initialData:
        categorySlug &&
        initialService?.category?.slug === categorySlug
          ? initialRelatedServices
          : undefined,
    });

  const relatedServices = relatedServicesRaw
    .filter((s) => s.slug !== serviceSlug)
    .slice(0, 9);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
            <ServiceSidebar
              service={service}
              relatedServices={relatedServices}
              isLoadingService={isLoadingService}
              isLoadingRelated={isLoadingRelated}
              currentSlug={serviceSlug}
            />

            <main className="flex-1 min-w-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pl-8">
              <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-zinc-100 py-4 space-y-3">
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
                          {service.providers.length === 1
                            ? "provider"
                            : "providers"}
                        </span>
                        <span>₹{service.basePrice.toLocaleString("en-IN")}</span>
                        {service.category && <span>{service.category.name}</span>}
                      </div>
                    </div>
                    {relatedServices.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 overscroll-x-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {relatedServices.map((s) => {
                          const isActive = s.slug === serviceSlug;
                          return (
                            <Link
                              key={s.id}
                              href={`/services/${s.slug}`}
                              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
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

              <div className="py-6 sm:py-8 space-y-4">
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

                <ProviderList service={service} isLoading={isLoadingService} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
