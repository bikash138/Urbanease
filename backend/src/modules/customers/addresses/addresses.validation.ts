import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.enum(["HOME", "WORK", "OTHER"]),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
  label: z.enum(["HOME", "WORK", "OTHER"]).optional(),
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  pincode: z.string().min(1).optional(),
});

export type CreateAddressDTO = z.infer<typeof createAddressSchema>;
export type UpdateAddressDTO = z.infer<typeof updateAddressSchema>;
