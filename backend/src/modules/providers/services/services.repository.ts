import { prisma } from "../../../../db";
import type { AddServiceDTO, UpdateServiceDTO } from "./services.validation";

const providerServiceSelect = {
  id: true,
  customPrice: true,
  isAvailable: true,
  providerId: true,
  serviceId: true,
  createdAt: true,
  updatedAt: true,
  service: true,
  slots: {
    select: {
      id: true,
      label: true,
      startTime: true,
      endTime: true,
      isActive: true,
    },
    orderBy: { startTime: "asc" as const },
  },
} as const;

export class ServicesRepository {
  async addService(providerId: string, data: AddServiceDTO) {
    return await prisma.providerService.create({
      data: {
        providerId,
        serviceId: data.serviceId,
        customPrice: data.customPrice,
        isAvailable: data.isAvailable ?? true,
        slots: {
          connect: data.slotIds.map((id) => ({ id })),
        },
      },
      select: providerServiceSelect,
    });
  }

  async getAllServices(providerId: string) {
    return await prisma.providerService.findMany({
      where: { providerId },
      select: providerServiceSelect,
    });
  }

  async updateService(
    providerId: string,
    providerServiceId: string,
    data: UpdateServiceDTO,
  ) {
    return await prisma.providerService.update({
      where: {
        id: providerServiceId,
        providerId: providerId,
      },
      data: {
        ...(data.customPrice !== undefined && { customPrice: data.customPrice }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.slotIds !== undefined && {
          slots: { set: data.slotIds.map((id) => ({ id })) },
        }),
      },
      select: providerServiceSelect,
    });
  }

  async removeService(providerId: string, providerServiceId: string) {
    return await prisma.providerService.delete({
      where: {
        id: providerServiceId,
        providerId: providerId,
      },
    });
  }
}
