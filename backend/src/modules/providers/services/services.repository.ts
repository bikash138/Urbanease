import { prisma } from "../../../../db";
import type { AddServiceDTO, UpdateServiceDTO } from "./services.validation";

export class ServicesRepository {
  async addService(providerId: string, data: AddServiceDTO) {
    return await prisma.providerService.create({
      data: {
        providerId,
        serviceId: data.serviceId,
        customPrice: data.customPrice,
        isAvailable: data.isAvailable ?? true,
      },
    });
  }

  async getAllServices(providerId: string) {
    return await prisma.providerService.findMany({
      where: { providerId },
      include: {
        service: true,
      },
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
      data,
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
