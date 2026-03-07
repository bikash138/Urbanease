"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPublicCategoriesAPI,
  getPublicCategoryBySlugAPI,
  getPublicServicesAPI,
  getPublicServiceBySlugAPI,
  getPublicProvidersAPI,
  getPublicProviderBySlugAPI,
  getPublicReviewsAPI,
  getPublicProviderSlotsAPI,
} from "@/api/public/public.api";
import {
  publicCategoryKeys,
  publicServiceKeys,
  publicProviderKeys,
  publicReviewKeys,
  publicSlotKeys,
} from "./query-keys";

export function usePublicCategories() {
  return useQuery({
    queryKey: publicCategoryKeys.list(),
    queryFn: async () => {
      const response = await getPublicCategoriesAPI();
      return response.data;
    },
  });
}

export function usePublicCategoryDetail(slug: string | null) {
  return useQuery({
    queryKey: publicCategoryKeys.detail(slug!),
    queryFn: async () => {
      const response = await getPublicCategoryBySlugAPI(slug!);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function usePublicServices(categoryId?: string) {
  return useQuery({
    queryKey: publicServiceKeys.list(categoryId),
    queryFn: async () => {
      const response = await getPublicServicesAPI(categoryId);
      return response.data;
    },
  });
}

export function usePublicServiceDetail(slug: string | null) {
  return useQuery({
    queryKey: publicServiceKeys.detail(slug!),
    queryFn: async () => {
      const response = await getPublicServiceBySlugAPI(slug!);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function usePublicProviders() {
  return useQuery({
    queryKey: publicProviderKeys.list(),
    queryFn: async () => {
      const response = await getPublicProvidersAPI();
      return response.data;
    },
  });
}

export function usePublicProviderDetail(slug: string | null) {
  return useQuery({
    queryKey: publicProviderKeys.detail(slug!),
    queryFn: async () => {
      const response = await getPublicProviderBySlugAPI(slug!);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function usePublicReviews(providerId?: string) {
  return useQuery({
    queryKey: publicReviewKeys.list(providerId),
    queryFn: async () => {
      const response = await getPublicReviewsAPI(providerId);
      return response.data;
    },
  });
}

export function usePublicProviderSlots(
  providerSlug: string | null,
  date: string | null,
  providerServiceId?: string | null,
) {
  return useQuery({
    queryKey: publicSlotKeys.list(
      providerSlug!,
      date!,
      providerServiceId ?? undefined,
    ),
    queryFn: async () => {
      const response = await getPublicProviderSlotsAPI(
        providerSlug!,
        date!,
        providerServiceId ?? undefined,
      );
      return response.data;
    },
    enabled: !!providerSlug && !!date,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}
