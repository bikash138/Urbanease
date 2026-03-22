"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPublicCategoriesAPI,
  getPublicCategoryBySlugAPI,
  getPublicServicesAPI,
  getPublicServiceBySlugAPI,
  getPublicProvidersAPI,
  getPublicProviderBySlugAPI,
  getPublicProviderSlotsAPI,
  searchPublicProvidersAPI,
} from "@/api/public/public.api";
import type {
  PublicCategory,
  PublicCategoryDetail,
  PublicProviderDetail,
  PublicService,
  PublicServiceDetail,
} from "@/types/public/public.types";
import {
  publicCategoryKeys,
  publicServiceKeys,
  publicProviderKeys,
  publicSlotKeys,
  publicSearchKeys,
} from "./query-keys";

export function usePublicCategories(options?: {
  initialData?: PublicCategory[];
}) {
  const { initialData } = options ?? {};
  return useQuery({
    queryKey: publicCategoryKeys.list(),
    queryFn: async () => {
      const response = await getPublicCategoriesAPI();
      return response.data;
    },
    initialData,
    staleTime: initialData !== undefined ? 60_000 : undefined,
  });
}

export function usePublicCategoryDetail(
  slug: string | null,
  options?: { initialData?: PublicCategoryDetail | null },
) {
  const { initialData } = options ?? {};
  return useQuery({
    queryKey: publicCategoryKeys.detail(slug!),
    queryFn: async () => {
      const response = await getPublicCategoryBySlugAPI(slug!);
      return response.data;
    },
    enabled: !!slug,
    initialData: initialData ?? undefined,
    staleTime: initialData !== undefined ? 60_000 : undefined,
  });
}

export function usePublicServices(
  categorySlugOrId?: string,
  options?: { enabled?: boolean; initialData?: PublicService[] },
) {
  const { enabled, initialData } = options ?? {};
  return useQuery({
    queryKey: publicServiceKeys.list(categorySlugOrId),
    queryFn: async () => {
      const response = await getPublicServicesAPI(categorySlugOrId);
      const data = response && typeof response === "object" && "data" in response
        ? (response as { data: unknown }).data
        : response;
      return Array.isArray(data) ? data : [];
    },
    enabled: enabled ?? true,
    initialData: initialData ?? undefined,
    staleTime:
      initialData !== undefined
        ? 60_000
        : 0,
    gcTime: initialData !== undefined ? undefined : 0,
  });
}

export function usePublicServiceDetail(
  slug: string | null,
  options?: { initialData?: PublicServiceDetail | null },
) {
  const { initialData } = options ?? {};
  return useQuery({
    queryKey: publicServiceKeys.detail(slug!),
    queryFn: async () => {
      const response = await getPublicServiceBySlugAPI(slug!);
      return response.data;
    },
    enabled: !!slug,
    initialData: initialData ?? undefined,
    staleTime: initialData !== undefined ? 60_000 : undefined,
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

export function usePublicProviderDetail(
  slug: string | null,
  options?: { initialData?: PublicProviderDetail | null },
) {
  const { initialData } = options ?? {};
  return useQuery({
    queryKey: publicProviderKeys.detail(slug!),
    queryFn: async () => {
      const response = await getPublicProviderBySlugAPI(slug!);
      return response.data;
    },
    enabled: !!slug,
    initialData: initialData ?? undefined,
    staleTime: initialData !== undefined ? 60_000 : undefined,
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

export function usePublicSearch(params: {
  category?: string;
  service?: string;
  city?: string;
}) {
  const hasFilters =
    !!params.category?.trim() ||
    !!params.service?.trim() ||
    !!params.city?.trim();

  return useQuery({
    queryKey: publicSearchKeys.list(params),
    queryFn: async () => {
      const response = await searchPublicProvidersAPI(params);
      return response.data;
    },
    enabled: hasFilters,
  });
}
