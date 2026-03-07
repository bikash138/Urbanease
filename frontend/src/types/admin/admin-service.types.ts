import { ApiResponse } from "@/lib/api-client";

export interface Service {
  id: string;
  title: string;
  description: string | null;
  basePrice: number;
  image: string;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
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
  image: string;
}

export interface UpdateServicePayload {
  title?: string;
  description?: string;
  basePrice?: number;
  categoryId?: string;
  isActive?: boolean;
  image?: string;
}

// --Response--

export type ServiceResponse = ApiResponse<Service>;
export type ServicesResponse = ApiResponse<Service[]>;
