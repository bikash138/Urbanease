"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProviderReviewsAPI,
  flagReviewAPI,
} from "@/api/provider/provider-review.api";
import { providerReviewKeys, providerBookingKeys } from "./query-keys";

export function useProviderReviews() {
  return useQuery({
    queryKey: providerReviewKeys.list(),
    queryFn: async () => {
      const res = await getProviderReviewsAPI();
      return res.data;
    },
  });
}

export function useFlagReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => flagReviewAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: providerReviewKeys.all });
      queryClient.invalidateQueries({ queryKey: providerBookingKeys.all });
    },
  });
}
