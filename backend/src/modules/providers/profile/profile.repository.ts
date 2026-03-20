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
        profileImage: data.profileImage,
      },
    });
  }

  async getProfile(providerId: string) {
    return await prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: {
        servicesOffered: { include: { service: true } },
        reviewsGained: true,
      },
    });
  }

  async updateProfile(providerId: string, data: UpdateProfileDTO) {
    const updateData: Parameters<typeof prisma.providerProfile.update>[0]["data"] =
      {};
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.experience !== undefined) updateData.experience = data.experience;
    if (data.profileImage != null) updateData.profileImage = data.profileImage;

    return await prisma.providerProfile.update({
      where: { id: providerId },
      data: updateData,
    });
  }
}
