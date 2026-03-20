import { z } from "zod";

export const createSigninSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password Lenght should not be less than 4"),
});

export const createAdminSigninSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password Lenght should not be less than 4"),
  adminKey: z
    .string({ error: "Admin key is required" })
    .min(1, "Admin key is required"),
});

export const createSignupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(4, "Password Lenght should not be less than 4"),
  role: z.enum(
    ["CUSTOMER", "PROVIDER"],
    "Role should be one of CUSTOMER and PROVIDER",
  ),
});

export type CreateSigninSchema = z.infer<typeof createSigninSchema>;
export type CreateAdminSigninSchema = z.infer<typeof createAdminSigninSchema>;
export type CreateSignupSchema = z.infer<typeof createSignupSchema>;
