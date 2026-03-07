import apiClient from "@/lib/api-client";
import {
  ProviderProfilePayload,
  ProviderProfileResponse,
} from "@/types/provider/provider-profile.types";

export async function createProviderProfileAPI(
  payload: ProviderProfilePayload = {},
): Promise<ProviderProfileResponse> {
  return apiClient.post("/provider/profile", payload);
}

export async function getProviderProfileAPI(): Promise<ProviderProfileResponse> {
  return apiClient.get("/provider/profile");
}

export async function updateProviderProfileAPI(
  payload: ProviderProfilePayload,
): Promise<ProviderProfileResponse> {
  return apiClient.put("/provider/profile", payload);
}
