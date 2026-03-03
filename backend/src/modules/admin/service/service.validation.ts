import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().optional(),
  basePrice: z.number().positive("Base price must be positive"),
  categoryId: z.string().uuid("Invalid category ID"),
});

export const updateServiceSchema = z.object({
  title: z.string().min(1, "Service title is required").optional(),
  description: z.string().optional(),
  basePrice: z.number().positive("Base price must be positive").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceSchemaDTO = z.infer<typeof createServiceSchema>;
export type UpdateServiceSchemaDTO = z.infer<typeof updateServiceSchema>;

export type ServiceIdParamDTO = {
  id: string;
};
