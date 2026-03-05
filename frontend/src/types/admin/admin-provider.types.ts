import { ApiResponse } from "@/lib/api-client";

// Update these fields if your backend returns a different shape
export interface ProviderProfile {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  bio: string;
  experience: number;
  rejectionReason: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: number;
  };
}

// --Request--

export interface ProviderStatusQuery {
  status?: "PENDING" | "APPROVED" | "REJECTED";
}

export interface RejectProviderPayload {
  rejectionReason: string;
}

// --Response--

export type ProviderResponse = ApiResponse<ProviderProfile>;
export type ProvidersResponse = ApiResponse<ProviderProfile[]>;
