import { z } from "zod";

export const createSigninSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Lenght should no be less 4"),
});

export const createSignupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(4, "Lenght should no be less 4"),
  role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]),
});

export type CreateSigninSchema = z.infer<typeof createSigninSchema>;
export type CreateSignupSchema = z.infer<typeof createSignupSchema>;
