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
  PublicSearchResponse,
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
  categorySlugOrId?: string,
): Promise<PublicServicesResponse> {
  if (!categorySlugOrId) return apiClient.get("/public/services");
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      categorySlugOrId,
    );
  const param = isUuid ? "categoryId" : "categorySlug";
  return apiClient.get(
    `/public/services?${param}=${encodeURIComponent(categorySlugOrId)}`,
  );
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

export async function searchPublicProvidersAPI(params: {
  category?: string;
  service?: string;
  city?: string;
}): Promise<PublicSearchResponse> {
  const searchParams = new URLSearchParams();
  if (params.category?.trim())
    searchParams.set("category", params.category.trim());
  if (params.service?.trim())
    searchParams.set("service", params.service.trim());
  if (params.city?.trim()) searchParams.set("city", params.city.trim());
  const query = searchParams.toString();
  if (!query) {
    return Promise.resolve({ success: true, data: [], message: "" });
  }
  return apiClient.get(`/public/search?${query}`);
}
