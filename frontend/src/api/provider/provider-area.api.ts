import apiClient from "@/lib/api-client";
import type { ProviderAreasResponse } from "@/types/provider/provider-area.types";

export async function getActiveAreasAPI(): Promise<ProviderAreasResponse> {
  return apiClient.get("/provider/areas");
}
