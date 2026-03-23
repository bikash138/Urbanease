import { z } from "zod";

const emailSchema = z.email().trim().toLowerCase();

const passwordSchema = z
  .string()
  .min(4, "Password length must be at least 4 characters")
  .max(30, "Password must be at most 30 characters");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(30)
  .refine((s) => !/[\x00-\x1F\x7F]/.test(s), {
    message: "Name cannot contain control characters",
  });

export const createSigninSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
});

export const createAdminSigninSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
  adminKey: z
    .string({ error: "Admin key is required" })
    .trim()
    .min(1, "Admin key is required")
    .max(50, "Admin key is too long"),
});

export const createSignupSchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(
    ["CUSTOMER", "PROVIDER"],
    "Role should be one of CUSTOMER and PROVIDER",
  ),
});

export const forgotPasswordSchema = z.strictObject({
  email: emailSchema,
});

export const resetPasswordSchema = z.strictObject({
  token: z.string().trim().min(1, "Token is required"),
  password: passwordSchema,
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export type CreateSigninSchema = z.infer<typeof createSigninSchema>;
export type CreateAdminSigninSchema = z.infer<typeof createAdminSigninSchema>;
export type CreateSignupSchema = z.infer<typeof createSignupSchema>;
