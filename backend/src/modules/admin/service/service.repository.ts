import { prisma } from "../../../../db";
import type {
  CreateServiceSchemaDTO,
  ServiceIdParamDTO,
  UpdateServiceSchemaDTO,
} from "./service.validation";

export class ServiceRepository {
  async createService(data: CreateServiceSchemaDTO) {
    return await prisma.service.create({
      data,
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        isActive: true,
        categoryId: true,
        createdAt: true,
      },
    });
  }

  async getAllServices() {
    return await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        isActive: true,
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async getServiceByID(data: ServiceIdParamDTO) {
    return await prisma.service.findUnique({
      where: { id: data.id },
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        isActive: true,
        category: {
          select: { id: true, name: true },
        },
        providers: {
          select: {
            id: true,
            customPrice: true,
            isAvailable: true,
            provider: {
              select: {
                id: true,
                user: { select: { name: true, phone: true } },
              },
            },
          },
        },
      },
    });
  }

  async updateServiceByID(id: string, data: UpdateServiceSchemaDTO) {
    return await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        isActive: true,
        categoryId: true,
      },
    });
  }

  async deleteServiceByID(data: ServiceIdParamDTO) {
    return await prisma.service.delete({
      where: { id: data.id },
      select: { id: true, title: true },
    });
  }
}
