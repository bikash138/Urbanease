"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerProfileAPI,
  createCustomerProfileAPI,
} from "@/api/customer/customer-profile.api";
import { customerProfileKeys } from "./query-keys";

export function useCustomerProfile() {
  return useQuery({
    queryKey: customerProfileKeys.detail(),
    queryFn: async () => {
      const response = await getCustomerProfileAPI();
      return response.data;
    },
  });
}

export function useCreateCustomerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createCustomerProfileAPI(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerProfileKeys.all });
    },
  });
}
