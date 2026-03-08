"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProviderProfileAPI,
  updateProviderProfileAPI,
} from "@/api/provider/provider-profile.api";
import type {
  ProviderProfileData,
  ProviderProfilePayload,
} from "@/types/provider/provider-profile.types";
import { providerProfileKeys } from "./query-keys";

export function useProviderProfile() {
  return useQuery({
    queryKey: providerProfileKeys.detail(),
    queryFn: async () => {
      const res = await getProviderProfileAPI();
      return res.data;
    },
  });
}

export function useUpdateProviderProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProviderProfilePayload) => {
      const res = await updateProviderProfileAPI(payload);
      return res.data;
    },
    onSuccess: (data: ProviderProfileData) => {
      queryClient.setQueryData(providerProfileKeys.detail(), data);
    },
  });
}
