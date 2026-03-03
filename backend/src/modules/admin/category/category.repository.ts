import { prisma } from "../../../../db";
import type {
  CreateServiceCategorySchemaDTO,
  ServiceCategoryIdParamDTO,
  UpdateServiceCategoryDTO,
} from "./category.validation";

export class CategoryRepository {
  async createServiceCategory(data: CreateServiceCategorySchemaDTO) {
    return await prisma.serviceCategory.create({ data });
  }

  async getAllServiceCategory() {
    return await prisma.serviceCategory.findMany();
  }

  async getServiceCategoryByID(data: ServiceCategoryIdParamDTO) {
    return await prisma.serviceCategory.findUnique({
      where: { id: data.id },
    });
  }

  async updateServiceCategoryByID(id: string, data: UpdateServiceCategoryDTO) {
    return await prisma.serviceCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
      },
    });
  }

  async deleteServiceCategoryByID(data: ServiceCategoryIdParamDTO) {
    return await prisma.serviceCategory.delete({
      where: { id: data.id },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
