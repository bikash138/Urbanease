export const categoryKeys = {
  all: ["admin", "categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};

export const serviceKeys = {
  all: ["admin", "services"] as const,
  list: () => [...serviceKeys.all, "list"] as const,
  detail: (id: string) => [...serviceKeys.all, "detail", id] as const,
};

export const providerKeys = {
  all: ["admin", "providers"] as const,
  list: (status?: string) => [...providerKeys.all, "list", { status }] as const,
  detail: (id: string) => [...providerKeys.all, "detail", id] as const,
};

export const adminReviewKeys = {
  all: ["admin", "reviews"] as const,
  flagged: () => [...adminReviewKeys.all, "flagged"] as const,
};

export const areaKeys = {
  all: ["admin", "areas"] as const,
  list: () => [...areaKeys.all, "list"] as const,
  detail: (id: string) => [...areaKeys.all, "detail", id] as const,
};
