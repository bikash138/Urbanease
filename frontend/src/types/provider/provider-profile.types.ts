import { ApiResponse } from "@/lib/api-client";

export interface ProviderProfilePayload {
  bio?: string;
  experience?: number;
  profileImage?: string | null;
}

// --Response--
export interface ProviderProfileData {
  id: string;
  bio: string | null;
  experience: number;
  profileImage: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export type ProviderProfileResponse = ApiResponse<ProviderProfileData>;
