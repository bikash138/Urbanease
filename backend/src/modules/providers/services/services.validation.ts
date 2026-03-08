import { z } from "zod";

export const addServiceSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),
  customPrice: z.number().positive("Custom price must be positive").optional(),
  isAvailable: z.boolean().optional(),
  areaIds: z.array(z.uuid("Invalid area ID")).optional(),
});

export const updateServiceSchema = z.object({
  customPrice: z.number().positive("Custom price must be positive").optional(),
  isAvailable: z.boolean().optional(),
});

export type AddServiceDTO = z.infer<typeof addServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>;
