import { z } from "zod";

export const createProfileSchema = z.object({
  bio: z.string().optional(),
  experience: z.number().int().min(0).optional(),
  profileImage: z.url(),
});

export const updateProfileSchema = z.object({
  bio: z.string().optional(),
  experience: z.number().int().min(0).optional(),
  profileImage: z.url().optional().nullable(),
});

export type CreateProfileDTO = z.infer<typeof createProfileSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
