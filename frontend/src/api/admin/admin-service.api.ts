import apiClient from "@/lib/api-client";
import {
  ServiceResponse,
  ServicesResponse,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/types/admin/admin-service.types";

export async function createServiceAPI(
  payload: CreateServicePayload,
): Promise<ServiceResponse> {
  return apiClient.post("/admin/service", payload);
}

export async function getAllServicesAPI(): Promise<ServicesResponse> {
  return apiClient.get("/admin/service");
}

export async function getServiceByIdAPI(id: string): Promise<ServiceResponse> {
  return apiClient.get(`/admin/service/${id}`);
}

export async function updateServiceAPI(
  id: string,
  payload: UpdateServicePayload,
): Promise<ServiceResponse> {
  return apiClient.put(`/admin/service/${id}`, payload);
}

export async function deleteServiceAPI(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return apiClient.delete(`/admin/service/${id}`);
}
