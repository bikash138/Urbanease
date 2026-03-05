import { ApiResponse } from "@/lib/api-client";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

// --Request--

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// --Response--

export type CategoryResponse = ApiResponse<ServiceCategory>;
export type CategoriesResponse = ApiResponse<ServiceCategory[]>;
