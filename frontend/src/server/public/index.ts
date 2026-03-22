import { cacheLife, cacheTag } from "next/cache";

import { config } from "@/lib/config";
import type {
  PublicCategoriesResponse,
  PublicProvidersResponse,
  PublicServicesResponse,
  PublicCategory,
  PublicProvider,
  PublicService,
} from "@/types/public/public.types";
import { API_VERSION } from "@/lib/api-client";


async function fetchPublicJson<T>(path: string): Promise<T> {
  const url = `${config.apiBaseUrl}${API_VERSION}${path.startsWith("/") ? path : `/${path}`}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new Error("Connection failed. The server may be unavailable.");
  }

  if (!res.ok) {
    let message = "Something went wrong";
    try {
      const errBody = (await res.json()) as {
        message?: string;
        errorCode?: string;
      };
      if (errBody?.message) {
        message = errBody.errorCode
          ? `${errBody.errorCode}: ${errBody.message}`
          : errBody.message;
      }
    } catch {
      /* use default message */
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export const PUBLIC_CATEGORIES_CACHE_TAG = "public-categories";
export const PUBLIC_SERVICES_CACHE_TAG = "public-services";
export const PUBLIC_PROVIDERS_CACHE_TAG = "public-providers";

export async function getPublicCategories(): Promise<PublicCategory[]> {
  "use cache";

  cacheTag(PUBLIC_CATEGORIES_CACHE_TAG);
  cacheLife({
    stale: 60,
    revalidate: 60,
    expire: 3600,
  });

  const res = await fetchPublicJson<PublicCategoriesResponse>("/public/categories");
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

  const path = categorySlug
    ? `/public/services?categorySlug=${encodeURIComponent(categorySlug)}`
    : "/public/services";
  const res = await fetchPublicJson<PublicServicesResponse>(path);
  return Array.isArray(res.data) ? res.data : [];
}

export async function getPublicProviders(): Promise<PublicProvider[]> {
  "use cache";

  cacheTag(PUBLIC_PROVIDERS_CACHE_TAG);
  cacheLife({
    stale: 60,
    revalidate: 60,
    expire: 3600,
  });

  const res = await fetchPublicJson<PublicProvidersResponse>("/public/providers");
  return Array.isArray(res.data) ? res.data : [];
}
