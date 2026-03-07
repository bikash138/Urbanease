import apiClient from "@/lib/api-client";
import type {
  ProviderReviewListResponse,
  ProviderReviewFlagResponse,
} from "@/types/provider/provider-review.types";

export async function getProviderReviewsAPI(): Promise<ProviderReviewListResponse> {
  return apiClient.get("/provider/reviews");
}

export async function flagReviewAPI(
  id: string,
): Promise<ProviderReviewFlagResponse> {
  return apiClient.patch(`/provider/reviews/${id}/flag`, {});
}
