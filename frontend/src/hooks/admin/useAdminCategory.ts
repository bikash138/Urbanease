"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryAPI,
  getAllCategoriesAPI,
  getCategoryByIdAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from "@/api/admin/admin-category.api";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/admin/admin-category.types";
import { categoryKeys } from "./query-keys";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const response = await getAllCategoriesAPI();
      return response.data;
    },
  });
}

export function useCategory(id: string | null) {
  return useQuery({
    queryKey: categoryKeys.detail(id!),
    queryFn: async () => {
      const response = await getCategoryByIdAPI(id!);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategoryAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategoryAPI(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
