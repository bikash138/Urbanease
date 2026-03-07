"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAddressesAPI,
  createAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  setDefaultAddressAPI,
} from "@/api/customer/customer-address.api";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/types/customer/customer-address.types";
import { customerAddressKeys } from "./query-keys";

export function useCustomerAddresses() {
  return useQuery({
    queryKey: customerAddressKeys.list(),
    queryFn: async () => {
      const response = await getAddressesAPI();
      return response.data;
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => createAddressAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerAddressKeys.all });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAddressPayload }) =>
      updateAddressAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerAddressKeys.all });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddressAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerAddressKeys.all });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultAddressAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerAddressKeys.all });
    },
  });
}
