"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProvidersAPI,
  getProviderByIdAPI,
  approveProviderAPI,
  rejectProviderAPI,
} from "@/api/admin/admin-provider.api";
import type {
  ProviderStatusQuery,
  RejectProviderPayload,
} from "@/types/admin/admin-provider.types";
import { providerKeys } from "./query-keys";

// ── Queries (READ) ─────────────────────────────────────────────────

/** Fetches all providers, optionally filtered by status. */
export function useProviders(query?: ProviderStatusQuery) {
  return useQuery({
    queryKey: providerKeys.list(query?.status),
    queryFn: async () => {
      const response = await getAllProvidersAPI(query);
      return response.data;
    },
  });
}

/** Fetches a single provider by ID. Only runs when `id` is provided. */
export function useProvider(id: string | null) {
  return useQuery({
    queryKey: providerKeys.detail(id!),
    queryFn: async () => {
      const response = await getProviderByIdAPI(id!);
      return response.data;
    },
    enabled: !!id,
  });
}

// ── Mutations (WRITE) ──────────────────────────────────────────────

export function useApproveProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveProviderAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.all });
    },
  });
}

export function useRejectProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RejectProviderPayload;
    }) => rejectProviderAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.all });
    },
  });
}
