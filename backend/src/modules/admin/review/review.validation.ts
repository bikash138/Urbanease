import { z } from "zod";

// Admin can only set VISIBLE or HIDDEN — not FLAGGED (that's provider-only)
export const updateReviewStatusSchema = z.object({
  status: z.enum(["VISIBLE", "HIDDEN"] as const, {
    error: "Admin can only set status to VISIBLE or HIDDEN",
  }),
});

export type UpdateReviewStatusDTO = z.infer<typeof updateReviewStatusSchema>;
