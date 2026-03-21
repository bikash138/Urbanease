import { cacheLife, cacheTag } from "next/cache";

import { getPublicCategoriesAPI, getPublicServicesAPI } from "@/api/public/public.api";
import type {
  PublicCategory,
  PublicService,
} from "@/types/public/public.types";

export const PUBLIC_CATEGORIES_CACHE_TAG = "public-categories";
export const PUBLIC_SERVICES_CACHE_TAG = "public-services";

export async function getPublicCategories(): Promise<PublicCategory[]> {
  "use cache";

  cacheTag(PUBLIC_CATEGORIES_CACHE_TAG);
  cacheLife({
    stale: 60,
    revalidate: 60,
    expire: 3600,
  });

  const res = await getPublicCategoriesAPI();
  return Array.isArray(res.data) ? res.data : [];
}

export async function getPublicServices(
  categorySlug?: string,
): Promise<PublicService[]> {
  "use cache";

  cacheTag(PUBLIC_SERVICES_CACHE_TAG);
  cacheLife({
    stale: 60,
    revalidate: 60,
    expire: 3600,
  });

  const res = await getPublicServicesAPI(categorySlug);
  return Array.isArray(res.data) ? res.data : [];
}
