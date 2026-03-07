import { ApiResponse } from "@/lib/api-client";

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type ImageType = "BEFORE" | "AFTER";

export type AddressLabel = "HOME" | "WORK" | "OTHER";

// ──────────────────────────────────────────────
// Nested shapes
// ──────────────────────────────────────────────

export interface BookingAddress {
  id: string;
  label: AddressLabel;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface BookingCustomerInfo {
  user: {
    name: string;
    phone: string | null;
  };
}

export interface BookingImage {
  id: string;
  url: string;
  type: ImageType;
  bookingId: string;
  createdAt: string;
}

export type ReviewStatus = "VISIBLE" | "FLAGGED" | "HIDDEN";

export interface BookingReviewSummary {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
}

export interface BookingReview {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingServiceSummary {
  service: {
    id: string;
    title: string;
  };
}

export interface BookingServiceDetail {
  service: {
    id: string;
    title: string;
    description: string | null;
    basePrice: number;
    isActive: boolean;
    categoryId: string;
  };
}

// ──────────────────────────────────────────────
// Core booking shapes
// ──────────────────────────────────────────────

/** Minimal image type for list view */
export interface BookingImageSummary {
  type: ImageType;
}

/** Returned by GET /provider/bookings (list) */
export interface BookingListItem {
  id: string;
  status: BookingStatus;
  date: string;
  startedAt: string | null;
  completedAt: string | null;
  totalAmount: number;
  customerNote: string | null;
  providerNote: string | null;
  address: BookingAddress;
  customer: BookingCustomerInfo;
  providerService: BookingServiceSummary;
  review: BookingReviewSummary | null;
  images?: BookingImageSummary[];
}

/** Returned by GET /provider/bookings/:id (full detail) */
export interface BookingDetail {
  id: string;
  status: BookingStatus;
  date: string;
  startedAt: string | null;
  completedAt: string | null;
  totalAmount: number;
  customerNote: string | null;
  providerNote: string | null;
  address: BookingAddress;
  customer: BookingCustomerInfo;
  providerService: BookingServiceDetail;
  images: BookingImage[];
  review: BookingReview | null;
}

// ──────────────────────────────────────────────
// Payloads
// ──────────────────────────────────────────────

export interface AddNotePayload {
  providerNote: string;
}

export interface AddImagePayload {
  url: string;
  type: ImageType;
}

// ──────────────────────────────────────────────
// Responses
// ──────────────────────────────────────────────

export type BookingListResponse = ApiResponse<BookingListItem[]>;
export type BookingDetailResponse = ApiResponse<BookingDetail>;

/** confirm / start / complete use updateMany → returns { count: number } */
export type BookingActionResponse = ApiResponse<{ count: number }>;

export type BookingCancelResponse = ApiResponse<{ id: string; status: BookingStatus }>;
export type BookingNoteResponse = ApiResponse<{ count: number }>;
export type BookingImageResponse = ApiResponse<BookingImage>;
export type BookingImagesResponse = ApiResponse<BookingImage[]>;
export type DeleteBookingImageResponse = ApiResponse<null>;
