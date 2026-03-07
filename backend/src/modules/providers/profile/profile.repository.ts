import { prisma } from "../../../../db";
import { createUserSlug } from "../../../common/utils/slug-generator";
import type { CreateProfileDTO, UpdateProfileDTO } from "./profile.validation";

export class ProfileRepository {
  async createProfile(userId: string, data: CreateProfileDTO) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true },
    });

    const slug = createUserSlug(user.name, userId);

    return await prisma.providerProfile.create({
      data: {
        userId,
        slug,
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
