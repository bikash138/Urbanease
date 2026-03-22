import { Suspense } from "react";
import { ServiceDetailPageFallback } from "@/components/public/fallbacks/ServiceDetailPageFallback";
import {
  getPublicServiceBySlug,
  getPublicServices,
} from "@/server/public";
import ServiceDetailClient from "./ServiceDetailClient";

async function ServiceDetailLoader({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  const { serviceSlug } = await params;
  const initialService = await getPublicServiceBySlug(serviceSlug);
  const initialRelatedServices = initialService?.category?.slug
    ? await getPublicServices(initialService.category.slug)
    : [];

  return (
    <ServiceDetailClient
      serviceSlug={serviceSlug}
      initialService={initialService}
      initialRelatedServices={initialRelatedServices}
    />
  );
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  return (
    <Suspense fallback={<ServiceDetailPageFallback />}>
      <ServiceDetailLoader params={params} />
    </Suspense>
  );
}
