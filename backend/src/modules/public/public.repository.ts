import { prisma } from "../../../db";
import type { SlotLabel } from "../../../generated/prisma/enums";
import { AppError } from "../../common/errors/app.error";

export class PublicRepository {
  async getAllCategories() {
    return await prisma.serviceCategory.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        image: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async getCategoryBySlug(slug: string) {
    return await prisma.serviceCategory.findUnique({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        image: true,
        services: {
          where: { isActive: true },
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            basePrice: true,
            image: true,
          },
        },
      },
    });
  }

  async getAllServices(categorySlugOrId?: string) {
    let categoryId: string | undefined;
    if (categorySlugOrId) {
      // Check if it's a UUID (categoryId) or slug
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          categorySlugOrId,
        );
      if (isUuid) {
        categoryId = categorySlugOrId;
      } else {
        const category = await prisma.serviceCategory.findUnique({
          where: { slug: categorySlugOrId, isActive: true },
          select: { id: true },
        });
        categoryId = category?.id;
      }
    }
    return await prisma.service.findMany({
      where: {
        isActive: true,
        ...(categoryId && { categoryId }),
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        basePrice: true,
        image: true,
        category: {
          select: { id: true, slug: true, name: true },
        },
      },
      orderBy: { title: "asc" },
    });
  }

  async getServiceBySlug(slug: string, skip: number, limit: number) {

    const service = await prisma.service.findUnique({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        basePrice: true,
        image: true,
        category: {
          select: { id: true, slug: true, name: true },
        },
      },
    });

    if (!service) return null;

    const providerWhere = {
      serviceId: service.id,
      isAvailable: true,
      provider: { status: "APPROVED" as const },
    };

    const [providers, total] = await Promise.all([
      prisma.providerService.findMany({
        where: providerWhere,
        select: {
          id: true,
          customPrice: true,
          provider: {
            select: {
              id: true,
              slug: true,
              bio: true,
              experience: true,
              profileImage: true,
              user: {
                select: { name: true, phone: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.providerService.count({
        where: providerWhere,
      }),
    ]);

    return {
      ...service,
      providers,
      total,
    };
  }

  async getAllProviders() {
    return await prisma.providerProfile.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        slug: true,
        bio: true,
        experience: true,
        profileImage: true,
        user: {
          select: { name: true },
        },
        servicesOffered: {
          where: { isAvailable: true },
          select: {
            id: true,
            customPrice: true,
            service: {
              select: {
                id: true,
                // slug: true,
                title: true,
                // basePrice: true,
                // image: true,
              },
            },
          },
        },
      },
    });
  }

  async getProviderBySlug(slug: string) {
    return await prisma.providerProfile.findUnique({
      where: { slug, status: "APPROVED" },
      select: {
        id: true,
        slug: true,
        bio: true,
        experience: true,
        profileImage: true,
        user: {
          select: { name: true, phone: true },
        },
        servicesOffered: {
          where: { isAvailable: true },
          select: {
            id: true,
            customPrice: true,
            service: {
              select: {
                id: true,
                slug: true,
                title: true,
                basePrice: true,
                image: true,
              },
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

  async getAvailableSlots(providerSlug: string, date: Date) {
    const slots = await prisma.providerSlot.findMany({
      where: {
        providerSlug,
        date,
      },
    });
    return slots.filter((s) => s.bookedSlots < s.totalSlots);
  }

  async searchProviders(filters: {
    category?: string;
    service?: string;
    city?: string;
    pageNum: number;
    limitNum: number;
  }) {
    const { category, service, city, pageNum, limitNum } = filters;

    const isUuid = (s: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

    const andConditions: object[] = [
      { isAvailable: true },
      { provider: { status: "APPROVED" } },
    ];

    if (category) {
      const term = category;
      andConditions.push({
        service: {
          isActive: true,
          category: isUuid(term)
            ? { id: term }
            : {
                isActive: true,
                OR: [
                  { slug: { contains: term, mode: "insensitive" } },
                  { name: { contains: term, mode: "insensitive" } },
                ],
              },
        },
      });
    }

    if (service) {
      const term = service;
      andConditions.push({
        service: isUuid(term)
          ? { id: term, isActive: true }
          : {
              isActive: true,
              OR: [
                { slug: { contains: term, mode: "insensitive" } },
                { title: { contains: term, mode: "insensitive" } },
              ],
            },
      });
    }

    if (city) {
      const term = city;
      andConditions.push({
        serviceArea: {
          some: {
            area: {
              isActive: true,
              OR: [
                { city: { contains: term, mode: "insensitive" } },
                { name: { contains: term, mode: "insensitive" } },
              ],
            },
          },
        },
      });
    }

    const skip = (pageNum - 1) * limitNum;

    const [providerServices, total] = await Promise.all([
      prisma.providerService.findMany({
        where: { AND: andConditions },
        select: {
          id: true,
          customPrice: true,
          service: {
            select: {
              id: true,
              slug: true,
              title: true,
              basePrice: true,
              image: true,
            },
          },
          provider: {
            select: {
              slug: true,
              profileImage: true,
              user: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.providerService.count({
        where: { AND: andConditions },
      }),
    ]);

    return {
      providerServices,
      total,
    };
  }

  async getPublicReviews(providerId?: string) {
    return await prisma.review.findMany({
      where: {
        status: { in: ["VISIBLE", "FLAGGED"] },
        ...(providerId && { providerId }),
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        status: true,
        customer: {
          select: { name: true },
        },
        provider: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
        booking: {
          select: {
            date: true,
            providerService: {
              select: {
                service: { select: { id: true, title: true } },
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
