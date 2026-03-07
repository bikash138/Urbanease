import apiClient from "@/lib/api-client";
import type {
  PublicCategoriesResponse,
  PublicCategoryDetailResponse,
  PublicServicesResponse,
  PublicServiceDetailResponse,
  PublicProvidersResponse,
  PublicProviderDetailResponse,
  PublicReviewsResponse,
  PublicProviderSlotsResponse,
} from "@/types/public/public.types";

export async function getPublicCategoriesAPI(): Promise<PublicCategoriesResponse> {
  return apiClient.get("/public/categories");
}

export async function getPublicCategoryBySlugAPI(
  slug: string,
): Promise<PublicCategoryDetailResponse> {
  return apiClient.get(`/public/categories/${slug}`);
}

export async function getPublicServicesAPI(
  categoryId?: string,
): Promise<PublicServicesResponse> {
  const params = categoryId ? `?categoryId=${categoryId}` : "";
  return apiClient.get(`/public/services${params}`);
}

export async function getPublicServiceBySlugAPI(
  slug: string,
): Promise<PublicServiceDetailResponse> {
  return apiClient.get(`/public/services/${slug}`);
}

export async function getPublicProvidersAPI(): Promise<PublicProvidersResponse> {
  return apiClient.get("/public/providers");
}

export async function getPublicProviderBySlugAPI(
  slug: string,
): Promise<PublicProviderDetailResponse> {
  return apiClient.get(`/public/providers/${slug}`);
}

export async function getPublicReviewsAPI(
  providerId?: string,
): Promise<PublicReviewsResponse> {
  const params = providerId ? `?providerId=${providerId}` : "";
  return apiClient.get(`/public/reviews${params}`);
}

export async function getPublicProviderSlotsAPI(
  providerSlug: string,
  date: string,
  providerServiceId?: string,
): Promise<PublicProviderSlotsResponse> {
  const params = new URLSearchParams({ date });
  if (providerServiceId) params.set("providerServiceId", providerServiceId);
  return apiClient.get(
    `/public/providers/${providerSlug}/slots?${params.toString()}`,
  );
}
