"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerReviewsAPI,
  createReviewAPI,
  updateReviewAPI,
  deleteReviewAPI,
} from "@/api/customer/customer-review.api";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
} from "@/types/customer/customer-review.types";
import { customerReviewKeys, customerBookingKeys } from "./query-keys";

export function useCustomerReviews() {
  return useQuery({
    queryKey: customerReviewKeys.list(),
    queryFn: async () => {
      const res = await getCustomerReviewsAPI();
      return res.data;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReviewAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerReviewKeys.all });
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) =>
      updateReviewAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerReviewKeys.all });
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReviewAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerReviewKeys.all });
      queryClient.invalidateQueries({ queryKey: customerBookingKeys.all });
    },
  });
}
