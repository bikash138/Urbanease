import { prisma } from "../../../../db";
import type { CreateProfileDTO, UpdateProfileDTO } from "./profile.validation";

export class ProfileRepository {
  async createProfile(userId: string, data: CreateProfileDTO) {
    return await prisma.providerProfile.create({
      data: {
        userId,
        bio: data.bio,
        experience: data.experience,
      },
    });
  }

  async getProfile(userId: string) {
    return await prisma.providerProfile.findUnique({
      where: { userId },
      include: {
        servicesOffered: { include: { service: true } },
        reviewsGained: true,
      },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    return await prisma.providerProfile.update({
      where: { userId },
      data,
    });
  }
}
