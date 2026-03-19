"use client";

import { useQuery } from "@tanstack/react-query";
import { getProviderStatsAPI } from "@/api/provider/provider-stats.api";
import { providerStatsKeys } from "./query-keys";

export function useProviderStats() {
  return useQuery({
    queryKey: providerStatsKeys.detail(),
    queryFn: async () => {
      const res = await getProviderStatsAPI();
      return res.data;
    },
  });
}
