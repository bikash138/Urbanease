import { z } from "zod";

export const signinSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const adminSigninSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  adminKey: z
    .string({ error: "Admin key is required" })
    .min(1, "Admin key is required"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
});

export type SigninFormValues = z.infer<typeof signinSchema>;
export type AdminSigninFormValues = z.infer<typeof adminSigninSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
