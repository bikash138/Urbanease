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

  async getAllServices(categoryId?: string) {
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

  async getServiceBySlug(slug: string) {
    return await prisma.service.findUnique({
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
                slug: true,
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
        slug: true,
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
    // await prisma.$transaction(async (tx) => {

    //   if(timing?.bookedSlots! >= timing?.totalSlots!){
    //     throw new Error("Slots Full for the selected timing")
    //   }

    //   await tx.providerSlot.update({
    //     where: {
    //       id: timing?.id
    //     },
    //     data: {
    //       bookedSlots: {increment: 1}
    //     }
    //   })
    // })

    // Get the specific ProviderService and only the slots that
    // this provider has configured for this service
    // const providerService = await prisma.providerService.findFirst({
    //   where: {
    //     provider: { slug: providerSlug },
    //     serviceId: service.id,
    //     isAvailable: true,
    //   },
    //   select: {
    //     id: true,
    //     provider: { select: { id: true } },
    //     slots: {
    //       where: { isActive: true },
    //       select: {
    //         id: true,
    //         label: true,
    //         startTime: true,
    //         endTime: true,
    //         isActive: true,
    //         serviceId: true,
    //       },
    //       orderBy: { startTime: "asc" },
    //     },
    //   },
    // });

    // if (!providerService) return [];

    // const [unavailabilities, booked] = await Promise.all([
    //   prisma.providerUnavailability.findMany({
    //     where: { providerId: providerService.provider.id, date },
    //     select: { slotId: true },
    //   }),
    //   // Only check bookings for this exact ProviderService (not all services)
    //   prisma.booking.findMany({
    //     where: {
    //       providerServiceId: providerService.id,
    //       date,
    //       status: { notIn: ["CANCELLED"] },
    //     },
    //     select: { slotId: true },
    //   }),
    // ]);

    // const blocked = new Set([
    //   ...unavailabilities.map((u) => u.slotId),
    //   ...booked.map((b) => b.slotId),
    // ]);
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
