import { z } from "zod";

export const createAreaSchema = z.object({
  name: z.string().min(1, "Area name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

export const updateAreaSchema = z.object({
  name: z.string().min(1, "Area name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  isActive: z.boolean().optional(),
});

export type CreateAreaSchemaDTO = z.infer<typeof createAreaSchema>;
export type UpdateAreaDTO = z.infer<typeof updateAreaSchema>;
export type AreaIdParamDTO = { id: string };
