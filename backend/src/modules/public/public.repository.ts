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

  async getAvailableSlots(providerId: string, serviceId: string, date: Date) {
    const allSlots = await prisma.slot.findMany({
      where: {
        serviceId,
        isActive: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const unavailabilities = await prisma.providerUnavailability.findMany({
      where: {
        providerId,
        date,
      },
      select: {
        slotId: true,
      },
    });

    const unavailableSlotIds = new Set(unavailabilities.map((u) => u.slotId));

    const booked = await prisma.booking.findMany({
      where: {
        providerService: {
          providerId,
        },
        date,
        status: {
          notIn: ["CANCELLED"],
        },
      },
      select: {
        slotId: true,
      },
    });

    const bookedSlotIds = new Set(booked.map((b) => b.slotId));

    return allSlots.filter(
      (slot) => !unavailableSlotIds.has(slot.id) && !bookedSlotIds.has(slot.id),
    );
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
