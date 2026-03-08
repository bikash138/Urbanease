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

export type CreateAreaFormValues = z.infer<typeof createAreaSchema>;
export type UpdateAreaFormValues = z.infer<typeof updateAreaSchema>;
