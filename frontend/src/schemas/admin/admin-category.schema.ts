import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.any().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  description: z.string().optional(),
  image: z.any().optional(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
