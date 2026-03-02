import { z } from "zod";

export const createServiceCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export const createServiceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().optional(),
  basePrice: z.number().positive("Base price must be positive"),
  categoryId: z.uuid("Invalid catefory ID"),
});

export type CreateServiceCategorySchemaDTO = z.infer<
  typeof createServiceCategorySchema
>;
export type CreateServiceSchemaDTO = z.infer<typeof createServiceSchema>;
