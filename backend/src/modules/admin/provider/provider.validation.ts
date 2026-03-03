import { z } from "zod";

// ─── Query Params ─────────────────────────────────────────────────────────────
export const providerStatusQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

// ─── Reject Body ──────────────────────────────────────────────────────────────
export const rejectProviderSchema = z.object({
  rejectionReason: z.string().min(1, "Rejection reason is required"),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProviderStatusQueryDTO = z.infer<typeof providerStatusQuerySchema>;
export type RejectProviderDTO = z.infer<typeof rejectProviderSchema>;

export type ProviderIdParamDTO = {
  id: string; // ProviderProfile.id
};
