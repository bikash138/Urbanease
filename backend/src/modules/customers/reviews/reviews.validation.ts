import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.uuid("Invalid booking ID"),
  rating: z.number().int().min(1, "Min rating is 1").max(5, "Max rating is 5"),
  comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type CreateReviewDTO = z.infer<typeof createReviewSchema>;
export type UpdateReviewDTO = z.infer<typeof updateReviewSchema>;
