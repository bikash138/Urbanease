import type { ApiResponse } from "@/lib/api-client";

export interface ProviderStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalEarnings: number;
}

export type ProviderStatsResponse = ApiResponse<ProviderStats>;
