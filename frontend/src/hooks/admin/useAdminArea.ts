"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAreaAPI,
  getAllAreasAPI,
  getAreaByIdAPI,
  updateAreaAPI,
  deleteAreaAPI,
} from "@/api/admin/admin-area.api";
import type {
  CreateAreaPayload,
  UpdateAreaPayload,
} from "@/types/admin/admin-area.types";
import { areaKeys } from "./query-keys";

export function useAreas() {
  return useQuery({
    queryKey: areaKeys.list(),
    queryFn: async () => {
      const response = await getAllAreasAPI();
      return response.data;
    },
  });
}

export function useArea(id: string | null) {
  return useQuery({
    queryKey: areaKeys.detail(id!),
    queryFn: async () => {
      const response = await getAreaByIdAPI(id!);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAreaPayload) => createAreaAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.all });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAreaPayload;
    }) => updateAreaAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.all });
    },
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAreaAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.all });
    },
  });
}
