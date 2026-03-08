"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveAreasAPI } from "@/api/provider/provider-area.api";
import { providerAreaKeys } from "./query-keys";

/** Fetches all active areas for the provider to select when adding services. */
export function useProviderAreas() {
  return useQuery({
    queryKey: providerAreaKeys.list(),
    queryFn: async () => {
      const response = await getActiveAreasAPI();
      return response.data;
    },
  });
}
