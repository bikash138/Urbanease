import { ApiResponse } from "@/lib/api-client";

export type ReviewStatus = "VISIBLE" | "FLAGGED" | "HIDDEN";

export interface ProviderReview {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  customerId: string;
  customer: { id: string; name: string };
  bookingId: string;
  createdAt: string;
  updatedAt: string;
}

export type ProviderReviewListResponse = ApiResponse<ProviderReview[]>;
export type ProviderReviewFlagResponse = ApiResponse<{
  id: string;
  status: ReviewStatus;
  rating: number;
  comment: string | null;
  updatedAt: string;
}>;
