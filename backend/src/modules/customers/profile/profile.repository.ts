import { prisma } from "../../../../db";

export class CustomerProfileRepository {
  async createProfile(userId: string) {
    return await prisma.customerProfile.create({
      data: { userId },
    });
  }

  async getProfile(userId: string) {
    return await prisma.customerProfile.findUnique({
      where: { userId },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
      },
    });
  }
}
