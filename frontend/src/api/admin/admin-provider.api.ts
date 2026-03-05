import apiClient from "@/lib/api-client";
import {
  ProviderResponse,
  ProvidersResponse,
  ProviderStatusQuery,
  RejectProviderPayload,
} from "@/types/admin/admin-provider.types";

export async function getAllProvidersAPI(
  query?: ProviderStatusQuery,
): Promise<ProvidersResponse> {
  const params = new URLSearchParams();
  if (query?.status) {
    params.append("status", query.status);
  }
  return apiClient.get(`/admin/provider?${params.toString()}`);
}

export async function getProviderByIdAPI(
  id: string,
): Promise<ProviderResponse> {
  return apiClient.get(`/admin/provider/${id}`);
}

export async function approveProviderAPI(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return apiClient.patch(`/admin/provider/${id}/approve`);
}

export async function rejectProviderAPI(
  id: string,
  payload: RejectProviderPayload,
): Promise<{ success: boolean; message: string }> {
  return apiClient.patch(`/admin/provider/${id}/reject`, payload);
}
