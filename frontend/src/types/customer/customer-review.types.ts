import { ApiResponse } from "@/lib/api-client";

export type ReviewStatus = "VISIBLE" | "FLAGGED" | "HIDDEN";

export interface CustomerReview {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  booking: { id: string; date: string };
  provider: { id: string; user: { name: string } };
  createdAt: string;
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export type CustomerReviewListResponse = ApiResponse<CustomerReview[]>;
export type CustomerReviewResponse = ApiResponse<CustomerReview>;
export type CustomerReviewDeleteResponse = ApiResponse<null>;
