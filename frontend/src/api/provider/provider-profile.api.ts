import apiClient from "@/lib/api-client";
import { ApiResponse } from "@/lib/api-client";
import { ProviderProfilePayload, ProviderProfileResponse } from "@/types/provider/provider-profile.types";


export async function createProviderProfileAPI(
  payload: ProviderProfilePayload = {},
): Promise<ProviderProfileResponse> {
  return apiClient.post("/provider/profile", payload);
}
