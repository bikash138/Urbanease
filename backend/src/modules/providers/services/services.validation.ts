import { z } from "zod";

export const addServiceSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),
  customPrice: z.number().positive("Custom price must be positive").optional(),
  isAvailable: z.boolean().optional(),
  slotIds: z
    .array(z.string().uuid("Invalid slot ID"))
    .min(1, "At least one slot must be selected"),
});

export const updateServiceSchema = z.object({
  customPrice: z.number().positive("Custom price must be positive").optional(),
  isAvailable: z.boolean().optional(),
  slotIds: z
    .array(z.string().uuid("Invalid slot ID"))
    .min(1, "At least one slot must be selected")
    .optional(),
});

export type AddServiceDTO = z.infer<typeof addServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>;
