import { prisma } from "../../../db";

export class PublicRepository {
  async getAllCategories() {
    return await prisma.serviceCategory.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: "asc" },
    });
  }
  async getCategoryByID(id: string) {
    return await prisma.serviceCategory.findMany({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        services: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            description: true,
            basePrice: true,
          },
        },
      },
    });
  }

  async getAllServices(categoryId?: string) {
    return await prisma.service.findMany({
      where: {
        isActive: true,
        ...(categoryId && { categoryId }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { title: "asc" },
    });
  }
  async getServiceByID(id: string) {
    return await prisma.service.findUnique({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        category: {
          select: { id: true, name: true },
        },
        providers: {
          where: {
            isAvailable: true,
            provider: { status: "APPROVED" },
          },
          select: {
            id: true,
            customPrice: true,
            provider: {
              select: {
                id: true,
                bio: true,
                experience: true,
                user: {
                  select: { name: true, phone: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async getAllProviders() {
    return await prisma.providerProfile.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        bio: true,
        experience: true,
        user: {
          select: { name: true, phone: true },
        },
        servicesOffered: {
          where: { isAvailable: true },
          select: {
            id: true,
            customPrice: true,
            service: {
              select: { id: true, title: true, basePrice: true },
            },
          },
        },
      },
    });
  }

  async getProviderByID(id: string) {
    return await prisma.providerProfile.findUnique({
      where: { id, status: "APPROVED" },
      select: {
        id: true,
        bio: true,
        experience: true,
        user: {
          select: { name: true, phone: true },
        },
        servicesOffered: {
          where: { isAvailable: true },
          select: {
            id: true,
            customPrice: true,
            service: {
              select: { id: true, title: true, basePrice: true },
            },
          },
        },
        reviewsGained: {
          where: { status: "VISIBLE" },
          select: {
            id: true,
            rating: true,
            comment: true,
            customer: {
              select: { name: true },
            },
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }
}
