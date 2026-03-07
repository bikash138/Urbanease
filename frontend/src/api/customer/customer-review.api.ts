import apiClient from "@/lib/api-client";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
  CustomerReviewListResponse,
  CustomerReviewResponse,
} from "@/types/customer/customer-review.types";

export async function getCustomerReviewsAPI(): Promise<CustomerReviewListResponse> {
  return apiClient.get("/customer/reviews");
}

export async function createReviewAPI(
  payload: CreateReviewPayload,
): Promise<CustomerReviewResponse> {
  return apiClient.post("/customer/reviews", payload);
}

export async function updateReviewAPI(
  id: string,
  payload: UpdateReviewPayload,
): Promise<CustomerReviewResponse> {
  return apiClient.put(`/customer/reviews/${id}`, payload);
}

export async function deleteReviewAPI(id: string): Promise<void> {
  return apiClient.delete(`/customer/reviews/${id}`);
}
