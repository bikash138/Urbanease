import { prisma } from "../../../db";
import type {
  CreateServiceSchemaDTO,
  CreateServiceCategorySchemaDTO,
} from "./admin.validation";

export class AdminRepository {
  async createServiceCategory(data: CreateServiceCategorySchemaDTO) {
    return await prisma.serviceCategory.create({
      data,
    });
  }
  async createService(data: CreateServiceSchemaDTO) {
    return await prisma.service.create({
      data,
    });
  }
}
