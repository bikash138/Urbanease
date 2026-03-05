import { ApiResponse } from "@/lib/api-client";

export interface ProviderProfilePayload {
  bio?: string;
  experience?: number;
}

// --Response--
export interface ProviderProfileData {
  id: string;
  bio: string | null;
  experience: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export type ProviderProfileResponse = ApiResponse<ProviderProfileData>;
