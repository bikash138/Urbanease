"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminFlaggedReviewsAPI,
  updateAdminReviewStatusAPI,
  deleteAdminReviewAPI,
} from "@/api/admin/admin-review.api";
import type { ReviewStatus } from "@/types/admin/admin-review.types";
import { adminReviewKeys } from "./query-keys";

export function useAdminFlaggedReviews() {
  return useQuery({
    queryKey: adminReviewKeys.flagged(),
    queryFn: async () => {
      const res = await getAdminFlaggedReviewsAPI();
      return res.data;
    },
  });
}

export function useUpdateAdminReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Extract<ReviewStatus, "VISIBLE" | "HIDDEN">;
    }) => updateAdminReviewStatusAPI(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewKeys.all });
    },
  });
}

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminReviewAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewKeys.all });
    },
  });
}
