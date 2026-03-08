import { z } from "zod";

export const rejectProviderSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Rejection reason must be at most 500 characters"),
});

export type RejectProviderFormValues = z.infer<typeof rejectProviderSchema>;
