export const providerServiceKeys = {
  all: ["provider", "services"] as const,
  list: () => [...providerServiceKeys.all, "list"] as const,
  detail: (id: string) => [...providerServiceKeys.all, "detail", id] as const,
};

export const providerBookingKeys = {
  all: ["provider", "bookings"] as const,
  list: (status?: string) =>
    [...providerBookingKeys.all, "list", { status }] as const,
  detail: (id: string) =>
    [...providerBookingKeys.all, "detail", id] as const,
  images: (id: string) =>
    [...providerBookingKeys.all, "images", id] as const,
};

export const providerReviewKeys = {
  all: ["provider", "reviews"] as const,
  list: () => [...providerReviewKeys.all, "list"] as const,
};
