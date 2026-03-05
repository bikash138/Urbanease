import apiClient from "@/lib/api-client";
import {
  CategoryResponse,
  CategoriesResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/admin/admin-category.types";

export async function createCategoryAPI(
  payload: CreateCategoryPayload,
): Promise<CategoryResponse> {
  return apiClient.post("/admin/category", payload);
}

export async function getAllCategoriesAPI(): Promise<CategoriesResponse> {
  return apiClient.get("/admin/category");
}

export async function getCategoryByIdAPI(
  id: string,
): Promise<CategoryResponse> {
  return apiClient.get(`/admin/category/${id}`);
}

export async function updateCategoryAPI(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<CategoryResponse> {
  return apiClient.put(`/admin/category/${id}`, payload);
}

export async function deleteCategoryAPI(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return apiClient.delete(`/admin/category/${id}`);
}
