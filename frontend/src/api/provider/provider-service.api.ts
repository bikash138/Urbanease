import apiClient from "@/lib/api-client";
import {
  AddServicePayload,
  AddServiceResponse,
  GetAllServicesResponse,
  UpdateServicePayload,
  UpdateServiceResponse,
  RemoveServiceResponse,
} from "@/types/provider/provider-service.types";

export async function addProviderServiceAPI(
  payload: AddServicePayload,
): Promise<AddServiceResponse> {
  return apiClient.post("/provider/services", payload);
}

export async function getAllProviderServicesAPI(): Promise<GetAllServicesResponse> {
  return apiClient.get("/provider/services");
}

export async function updateProviderServiceAPI(
  id: string,
  payload: UpdateServicePayload,
): Promise<UpdateServiceResponse> {
  return apiClient.patch(`/provider/services/${id}`, payload);
}

export async function removeProviderServiceAPI(
  id: string,
): Promise<RemoveServiceResponse> {
  return apiClient.delete(`/provider/services/${id}`);
}
