export type CacheKey = string;

export const CacheKeys = {
  publicCategories: () => "public:categories",
  publicCategory: (slug: string) => `public:category:${slug}`,
  publicServices: (categorySlug?: string) =>
    categorySlug
      ? `public:services:category:${categorySlug}`
      : "public:services:all",
  publicService: (slug: string) => `public:service:${slug}`,
  publicProvider: (providerSlug?: string) =>
    providerSlug
      ? `public:provider:${providerSlug}`
      : "public:providers:all",
} as const;
  