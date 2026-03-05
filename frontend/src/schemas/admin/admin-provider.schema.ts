import { z } from "zod";

export const rejectProviderSchema = z.object({
  rejectionReason: z.string().min(1, "Rejection reason is required"),
});

export type RejectProviderFormValues = z.infer<typeof rejectProviderSchema>;
