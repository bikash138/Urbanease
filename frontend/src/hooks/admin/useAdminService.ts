"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceAPI,
  getAllServicesAPI,
  getServiceByIdAPI,
  updateServiceAPI,
  deleteServiceAPI,
} from "@/api/admin/admin-service.api";
import type {
  CreateServicePayload,
  UpdateServicePayload,
} from "@/types/admin/admin-service.types";
import { serviceKeys } from "./query-keys";


export function useServices() {
  return useQuery({
    queryKey: serviceKeys.list(),
    queryFn: async () => {
      const response = await getAllServicesAPI();
      return response.data;
    },
  });
}

export function useService(id: string | null) {
  return useQuery({
    queryKey: serviceKeys.detail(id!),
    queryFn: async () => {
      const response = await getServiceByIdAPI(id!);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => createServiceAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateServicePayload;
    }) => updateServiceAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteServiceAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}
