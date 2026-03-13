import { prisma } from "../../../../db";
import type {
  ProviderIdParamDTO,
  ProviderStatusQueryDTO,
  RejectProviderDTO,
} from "./provider.validation";

const providerListSelect = {
  id: true,
  status: true,
  bio: true,
  experience: true,
  rejectionReason: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
    },
  },
};

export class ProviderRepository {
  async getAllProviders(query: ProviderStatusQueryDTO) {
    return await prisma.providerProfile.findMany({
      where: {
        ...(query.status && { status: query.status }),
      },
      select: providerListSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getProviderByID(data: ProviderIdParamDTO) {
    return await prisma.providerProfile.findUnique({
      where: { id: data.id },
      select: {
        ...providerListSelect,
        servicesOffered: {
          select: {
            id: true,
            customPrice: true,
            isAvailable: true,
            service: {
              select: { id: true, title: true, basePrice: true },
            },
          },
        },
        reviewsGained: {
          select: {
            id: true,
            rating: true,
            comment: true,
            status: true,
            customer: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async approveProvider(data: ProviderIdParamDTO) {
    return await prisma.providerProfile.update({
      where: { id: data.id },
      data: {
        status: "APPROVED",
        rejectionReason: null,
      },
      select: {
        id: true,
        slug: true,
        status: true,
        user: { select: { name: true, email: true } },
      },
    });
  }

  async rejectProvider(data: ProviderIdParamDTO, body: RejectProviderDTO) {
    return await prisma.providerProfile.update({
      where: { id: data.id },
      data: {
        status: "REJECTED",
        rejectionReason: body.rejectionReason,
      },
      select: {
        id: true,
        slug: true,
        status: true,
        rejectionReason: true,
        user: { select: { name: true, email: true } },
      },
    });
  }
}
