import { ApiResponse } from "@/lib/api-client";
import { ServiceCategory } from "./admin-category.types";

export interface Service {
  id: string;
  title: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  category: {
    name: string;
  };
  createdAt: string;
}

// --Request--

export interface CreateServicePayload {
  title: string;
  description?: string;
  basePrice: number;
  categoryId: string;
}

export interface UpdateServicePayload {
  title?: string;
  description?: string;
  basePrice?: number;
  categoryId?: string;
  isActive?: boolean;
}

// --Response--

export type ServiceResponse = ApiResponse<Service>;
export type ServicesResponse = ApiResponse<Service[]>;
