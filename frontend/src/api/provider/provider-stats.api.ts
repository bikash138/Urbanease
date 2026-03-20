import type { ProviderStatsResponse } from "@/types/provider/provider-stats.types";
import apiClient from "@/lib/api-client";

export async function getProviderStatsAPI(): Promise<ProviderStatsResponse> {
  return apiClient.get("/provider/stats");
}
