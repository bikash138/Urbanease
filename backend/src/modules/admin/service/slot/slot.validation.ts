import { z } from "zod";

export const createSlotSchema = z.object({
  label: z.enum(["MORNING", "AFTERNOON", "NIGHT"]),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "startTime must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "endTime must be in HH:MM format"),
});

export const updateSlotSchema = z.object({
  label: z.enum(["MORNING", "AFTERNOON", "NIGHT"]).optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "startTime must be in HH:MM format")
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "endTime must be in HH:MM format")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateSlotDTO = z.infer<typeof createSlotSchema>;
export type UpdateSlotDTO = z.infer<typeof updateSlotSchema>;
