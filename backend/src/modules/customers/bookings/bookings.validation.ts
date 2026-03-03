import { z } from "zod";

export const createBookingSchema = z.object({
  providerServiceId: z.uuid("Invalid provider service ID"),
  addressId: z.uuid("Invalid address ID"),
  slotId: z.uuid("Invalid slod ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  totalAmount: z.number().positive("Total amount must be positive"),
  customerNote: z.string().optional(),
});

export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
