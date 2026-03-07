import { z } from "zod";

export const createBookingSchema = z.object({
  providerServiceId: z.uuid("Invalid provider service ID"),
  addressId: z.uuid("Invalid address ID"),
  slotId: z.uuid("Invalid slod ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  totalAmount: z.number().positive("Total amount must be positive"),
  customerNote: z.string().optional(),
});

export const rescheduleBookingSchema = z.object({
  slotId: z.uuid("Invalid slot ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
export type RescheduleBookingDTO = z.infer<typeof rescheduleBookingSchema>;
