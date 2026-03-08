import { z } from "zod";

export const addServiceSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),
  customPrice: z.coerce
    .number()
    .positive("Custom price must be positive")
    .optional(),
  isAvailable: z.boolean().optional(),
  areaIds: z.array(z.uuid("Invalid area ID")).optional(),
});

export const updateServiceSchema = z.object({
  customPrice: z.coerce
    .number()
    .positive("Custom price must be positive")
    .optional(),
  isAvailable: z.boolean().optional(),
});

export type AddServiceFormValues = z.infer<typeof addServiceSchema>;
export type UpdateServiceFormValues = z.infer<typeof updateServiceSchema>;
