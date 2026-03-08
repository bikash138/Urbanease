import apiClient from "@/lib/api-client";
import {
  AreaResponse,
  AreasResponse,
  CreateAreaPayload,
  UpdateAreaPayload,
} from "@/types/admin/admin-area.types";

export async function createAreaAPI(
  payload: CreateAreaPayload,
): Promise<AreaResponse> {
  return apiClient.post("/admin/area", payload);
}

export async function getAllAreasAPI(): Promise<AreasResponse> {
  return apiClient.get("/admin/area");
}

export async function getAreaByIdAPI(id: string): Promise<AreaResponse> {
  return apiClient.get(`/admin/area/${id}`);
}

export async function updateAreaAPI(
  id: string,
  payload: UpdateAreaPayload,
): Promise<AreaResponse> {
  return apiClient.put(`/admin/area/${id}`, payload);
}

export async function deleteAreaAPI(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return apiClient.delete(`/admin/area/${id}`);
}
