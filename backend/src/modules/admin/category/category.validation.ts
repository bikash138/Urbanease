import { z } from "zod";

export const createServiceCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  image: z.url("Valid image URL is required"),
});

export const updateServiceCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  description: z.string().optional(),
  image: z.url("Valid image URL is required").optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceCategorySchemaDTO = z.infer<
  typeof createServiceCategorySchema
>;

export type ServiceCategoryIdParamDTO = {
  id: string;
};

export type UpdateServiceCategoryDTO = z.infer<
  typeof updateServiceCategorySchema
>;
