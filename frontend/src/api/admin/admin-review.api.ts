import apiClient from "@/lib/api-client";
import type {
  AdminFlaggedReviewListResponse,
  AdminReviewStatusResponse,
  ReviewStatus,
} from "@/types/admin/admin-review.types";

export async function getAdminFlaggedReviewsAPI(): Promise<AdminFlaggedReviewListResponse> {
  return apiClient.get("/admin/review");
}

export async function updateAdminReviewStatusAPI(
  id: string,
  status: Extract<ReviewStatus, "VISIBLE" | "HIDDEN">,
): Promise<AdminReviewStatusResponse> {
  return apiClient.patch(`/admin/review/${id}/status`, { status });
}

export async function deleteAdminReviewAPI(id: string): Promise<void> {
  return apiClient.delete(`/admin/review/${id}`);
}
