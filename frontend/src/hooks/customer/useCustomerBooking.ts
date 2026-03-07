"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerBookingsAPI,
  getCustomerBookingByIDAPI,
  createBookingAPI,
  cancelCustomerBookingAPI,
  rescheduleBookingAPI,
} from "@/api/customer/customer-booking.api";
import type {
  CreateBookingPayload,
  RescheduleBookingPayload,
} from "@/types/customer/customer-booking.types";
import { customerBookingKeys } from "./query-keys";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBookingAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
    },
  });
}

export function useCustomerBookings(status?: string) {
  return useQuery({
    queryKey: customerBookingKeys.list(status),
    queryFn: async () => {
      const response = await getCustomerBookingsAPI(status);
      return response.data;
    },
  });
}

export function useCustomerBookingByID(id: string | null) {
  return useQuery({
    queryKey: customerBookingKeys.detail(id!),
    queryFn: async () => {
      const response = await getCustomerBookingByIDAPI(id!);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCancelCustomerBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelCustomerBookingAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
    },
  });
}

export function useRescheduleBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RescheduleBookingPayload;
    }) => rescheduleBookingAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
    },
  });
}
