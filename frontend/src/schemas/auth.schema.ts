import { z } from "zod";

const emailSchema = z.email("Enter a valid email").trim().toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(30)
  .refine((s) => !/[\x00-\x1F\x7F]/.test(s), {
    message: "Name cannot contain control characters",
  });

export const signinSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
});

export const adminSigninSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
  adminKey: z
    .string({ error: "Admin key is required" })
    .trim()
    .min(1, "Admin key is required")
    .max(512, "Admin key is too long"),
});

export const signupSchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["CUSTOMER", "PROVIDER"]),
});

export type SigninFormValues = z.infer<typeof signinSchema>;
export type AdminSigninFormValues = z.infer<typeof adminSigninSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
