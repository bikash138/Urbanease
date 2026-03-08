import { prisma } from "../../../../db";
import { createSlug } from "../../../common/utils/slug-generator";
import type {
  CreateServiceSchemaDTO,
  ServiceIdParamDTO,
  UpdateServiceSchemaDTO,
} from "./service.validation";

export class ServiceRepository {
  async createService(data: CreateServiceSchemaDTO) {
    return await prisma.service.create({
      data: {
        title: data.title,
        slug: createSlug(data.title),
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        image: data.image,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        basePrice: true,
        isActive: true,
        image: true,
        categoryId: true,
        category: { select: { name: true } },
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
        image: true,
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
        image: true,
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
    return await prisma.$transaction(async (tx) => {
      return await tx.service.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
          ...(data.categoryId !== undefined && {
            categoryId: data.categoryId,
          }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.isActive !== undefined && {
            isActive: data.isActive,
          }),
        },
        select: {
          id: true,
          title: true,
          description: true,
          basePrice: true,
          isActive: true,
          image: true,
          categoryId: true,
        },
      });
    });
  }

  async deleteServiceByID(data: ServiceIdParamDTO) {
    return await prisma.service.delete({
      where: { id: data.id },
      select: { id: true, title: true },
    });
  }
}
