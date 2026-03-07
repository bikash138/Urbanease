import { ApiResponse } from "@/lib/api-client";

export type ReviewStatus = "VISIBLE" | "FLAGGED" | "HIDDEN";

export interface AdminFlaggedReview {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  customer: { id: string; name: string };
  provider: { id: string; user: { name: string } };
  booking: {
    id: string;
    date: string;
    providerServiceId: string;
    providerService: { service: { title: string } };
  };
  createdAt: string;
  updatedAt: string;
}

export type AdminFlaggedReviewListResponse = ApiResponse<AdminFlaggedReview[]>;
export type AdminReviewStatusResponse = ApiResponse<{
  id: string;
  status: ReviewStatus;
  rating: number;
  comment: string | null;
  updatedAt: string;
}>;
