import { z } from "zod";

export const addServiceSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),
  customPrice: z.coerce
    .number()
    .positive("Custom price must be positive")
    .optional(),
  isAvailable: z.boolean().optional(),
  slotIds: z
    .array(z.string())
    .min(1, "Select at least one slot"),
});

export const updateServiceSchema = z.object({
  customPrice: z.coerce
    .number()
    .positive("Custom price must be positive")
    .optional(),
  isAvailable: z.boolean().optional(),
  slotIds: z
    .array(z.string())
    .min(1, "Select at least one slot")
    .optional(),
});

export type AddServiceFormValues = z.infer<typeof addServiceSchema>;
export type UpdateServiceFormValues = z.infer<typeof updateServiceSchema>;
