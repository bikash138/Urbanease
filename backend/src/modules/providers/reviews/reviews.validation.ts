import { z } from "zod";

export const reviewStatusQuerySchema = z.object({
  status: z.enum(["VISIBLE", "FLAGGED", "HIDDEN"]).optional(),
});

export type ReviewStatusQueryDTO = z.infer<typeof reviewStatusQuerySchema>;
