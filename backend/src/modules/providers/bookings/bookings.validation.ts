import { z } from "zod";

export const addNoteSchema = z.object({
  providerNote: z.string().min(1, "Note cannot be empty"),
});

export const addImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  type: z.enum(["BEFORE", "AFTER"]),
});

export type AddNoteDTO = z.infer<typeof addNoteSchema>;
export type AddImageDTO = z.infer<typeof addImageSchema>;
