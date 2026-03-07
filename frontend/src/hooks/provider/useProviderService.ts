"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProviderServiceAPI,
  getAllProviderServicesAPI,
  updateProviderServiceAPI,
  removeProviderServiceAPI,
} from "@/api/provider/provider-service.api";
import type {
  AddServicePayload,
  UpdateServicePayload,
} from "@/types/provider/provider-service.types";
import { providerServiceKeys } from "./query-keys";

// ── Queries (READ) ─────────────────────────────────────────────────

/** Fetches all services listed by the authenticated provider. */
export function useProviderServices() {
  return useQuery({
    queryKey: providerServiceKeys.list(),
    queryFn: async () => {
      const response = await getAllProviderServicesAPI();
      return response.data;
    },
  });
}

// ── Mutations (WRITE) ──────────────────────────────────────────────

/** Adds a platform service to the provider's listed services. */
export function useAddProviderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddServicePayload) => addProviderServiceAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerServiceKeys.all });
    },
  });
}

/** Updates customPrice or availability of a provider's listed service. */
export function useUpdateProviderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServicePayload }) =>
      updateProviderServiceAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerServiceKeys.all });
    },
  });
}

/** Removes a service from the provider's listed services. */
export function useRemoveProviderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeProviderServiceAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerServiceKeys.all });
    },
  });
}
