import { ApiResponse } from "@/lib/api-client";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface CustomerBookingAddress {
  id: string;
  label: "HOME" | "WORK" | "OTHER";
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface CustomerBookingProviderInfo {
  id: string;
  slug: string;
  user: { name: string };
}

export type ReviewStatus = "VISIBLE" | "FLAGGED" | "HIDDEN";

export interface CustomerBookingReviewSummary {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
}

export interface CustomerBookingListItem {
  id: string;
  status: BookingStatus;
  date: string;
  startedAt: string | null;
  completedAt: string | null;
  totalAmount: number;
  customerNote: string | null;
  providerNote: string | null;
  address: CustomerBookingAddress;
  providerService: {
    id: string;
    service: { id: string; title: string; slug: string };
    provider: CustomerBookingProviderInfo;
  };
  review: CustomerBookingReviewSummary | null;
  images?: CustomerBookingImage[];
}

export interface CreateBookingPayload {
  providerServiceId: string;
  addressId: string;
  slotId: string;
  date: string;
  totalAmount: number;
  customerNote?: string;
}

export interface RescheduleBookingPayload {
  slotId: string;
  date: string;
}

export interface CustomerBookingImage {
  id: string;
  url: string;
  type: "BEFORE" | "AFTER";
}

export interface CustomerBookingDetail extends CustomerBookingListItem {
  providerService: CustomerBookingListItem["providerService"] & {
    service: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      basePrice: number;
      image: string;
    };
    provider: CustomerBookingProviderInfo & {
      bio: string | null;
      user: { name: string; phone: string | null };
    };
  };
  images?: CustomerBookingImage[];
}

export type CustomerBookingListResponse = ApiResponse<CustomerBookingListItem[]>;
export type CustomerBookingDetailResponse = ApiResponse<CustomerBookingDetail>;
export type CustomerBookingActionResponse = ApiResponse<{
  id: string;
  status: BookingStatus;
}>;
export type RescheduleBookingResponse = ApiResponse<{
  id: string;
  status: BookingStatus;
  date: string;
  slotId: string;
}>;
