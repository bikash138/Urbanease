import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().optional(),
  basePrice: z.coerce.number().positive("Base price must be positive"),
  categoryId: z.string().min(1, "Invalid category ID"),
});

export const updateServiceSchema = z.object({
  title: z.string().min(1, "Service title is required").optional(),
  description: z.string().optional(),
  basePrice: z.coerce
    .number()
    .positive("Base price must be positive")
    .optional(),
  categoryId: z.string().min(1, "Invalid category ID").optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceFormValues = z.infer<typeof createServiceSchema>;
export type UpdateServiceFormValues = z.infer<typeof updateServiceSchema>;
