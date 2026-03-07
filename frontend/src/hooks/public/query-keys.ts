export const publicCategoryKeys = {
  all: ["public", "categories"] as const,
  list: () => [...publicCategoryKeys.all, "list"] as const,
  detail: (slug: string) => [...publicCategoryKeys.all, "detail", slug] as const,
};

export const publicServiceKeys = {
  all: ["public", "services"] as const,
  list: (categoryId?: string) =>
    [...publicServiceKeys.all, "list", { categoryId }] as const,
  detail: (slug: string) => [...publicServiceKeys.all, "detail", slug] as const,
};

export const publicProviderKeys = {
  all: ["public", "providers"] as const,
  list: () => [...publicProviderKeys.all, "list"] as const,
  detail: (slug: string) => [...publicProviderKeys.all, "detail", slug] as const,
};

export const publicReviewKeys = {
  all: ["public", "reviews"] as const,
  list: (providerId?: string) =>
    [...publicReviewKeys.all, "list", { providerId }] as const,
};

export const publicSlotKeys = {
  all: ["public", "slots"] as const,
  list: (providerSlug: string, date: string, providerServiceId?: string) =>
    [
      ...publicSlotKeys.all,
      "list",
      { providerSlug, date, providerServiceId },
    ] as const,
};
