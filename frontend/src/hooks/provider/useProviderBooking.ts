"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProviderBookingsAPI,
  getProviderBookingByIdAPI,
  getProviderBookingImagesAPI,
  confirmProviderBookingAPI,
  startProviderBookingAPI,
  completeProviderBookingAPI,
  cancelProviderBookingAPI,
  addProviderBookingNoteAPI,
  addProviderBookingImageAPI,
  deleteProviderBookingImageAPI,
} from "@/api/provider/provider-booking.api";
import type {
  BookingStatus,
  AddNotePayload,
  AddImagePayload,
} from "@/types/provider/provider-booking.types";
import { providerBookingKeys } from "./query-keys";

// ── Queries (READ) ─────────────────────────────────────────────────

/**
 * Fetch bookings filtered by status.
 * Pass no status to fetch all — useful for an "All" tab.
 */
export function useProviderBookings(status?: BookingStatus) {
  return useQuery({
    queryKey: providerBookingKeys.list(status),
    queryFn: async () => {
      const res = await getAllProviderBookingsAPI(status);
      return res.data;
    },
  });
}

/** Fetch a single booking's full detail. Only runs when id is provided. */
export function useProviderBookingById(id: string | null) {
  return useQuery({
    queryKey: providerBookingKeys.detail(id!),
    queryFn: async () => {
      const res = await getProviderBookingByIdAPI(id!);
      return res.data;
    },
    enabled: !!id,
  });
}

/** Fetch before/after images for a booking. */
export function useProviderBookingImages(id: string | null) {
  return useQuery({
    queryKey: providerBookingKeys.images(id!),
    queryFn: async () => {
      const res = await getProviderBookingImagesAPI(id!);
      return res.data;
    },
    enabled: !!id,
  });
}

// ── Status mutations (WRITE) ───────────────────────────────────────

/** PENDING → CONFIRMED */
export function useConfirmBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmProviderBookingAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerBookingKeys.all });
    },
  });
}

/** CONFIRMED → IN_PROGRESS */
export function useStartBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => startProviderBookingAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerBookingKeys.all });
    },
  });
}

/** IN_PROGRESS → COMPLETED */
export function useCompleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeProviderBookingAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerBookingKeys.all });
    },
  });
}

/** PENDING | CONFIRMED → CANCELLED */
export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelProviderBookingAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerBookingKeys.all });
    },
  });
}

// ── Note & image mutations ─────────────────────────────────────────

export function useAddBookingNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddNotePayload }) =>
      addProviderBookingNoteAPI(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: providerBookingKeys.detail(variables.id),
      });
    },
  });
}

export function useAddBookingImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddImagePayload }) =>
      addProviderBookingImageAPI(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: providerBookingKeys.images(variables.id),
      });
    },
  });
}

export function useDeleteBookingImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imgId }: { id: string; imgId: string }) =>
      deleteProviderBookingImageAPI(id, imgId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: providerBookingKeys.images(variables.id),
      });
    },
  });
}
