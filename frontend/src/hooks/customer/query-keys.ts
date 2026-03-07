export const customerProfileKeys = {
  all: ["customer", "profile"] as const,
  detail: () => [...customerProfileKeys.all, "detail"] as const,
};

export const customerAddressKeys = {
  all: ["customer", "addresses"] as const,
  list: () => [...customerAddressKeys.all, "list"] as const,
};

export const customerBookingKeys = {
  all: ["customer", "bookings"] as const,
  list: (status?: string) =>
    [...customerBookingKeys.all, "list", { status }] as const,
  detail: (id: string) => [...customerBookingKeys.all, "detail", id] as const,
};

export const customerReviewKeys = {
  all: ["customer", "reviews"] as const,
  list: () => [...customerReviewKeys.all, "list"] as const,
};
