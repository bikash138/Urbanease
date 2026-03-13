import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { invalidateMany } from "../../../lib/cache";
import { CacheKeys } from "../../../lib/cache-keys";
import { CategoryRepository } from "./category.repository";
import type {
  CreateServiceCategorySchemaDTO,
  ServiceCategoryIdParamDTO,
  UpdateServiceCategoryDTO,
} from "./category.validation";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async addServiceCategory(data: CreateServiceCategorySchemaDTO) {
    try {
      const category =
        await this.categoryRepository.createServiceCategory(data);
      await invalidateMany([CacheKeys.publicCategories()]);
      return category;
    } catch (error) {
      throw new AppError(
        "Service Category creation failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllServiceCategory() {
    try {
      return await this.categoryRepository.getAllServiceCategory();
    } catch (error) {
      throw new AppError(
        "Get all service categories failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getServiceCategoryByID(data: ServiceCategoryIdParamDTO) {
    try {
      const category =
        await this.categoryRepository.getServiceCategoryByID(data);
      if (!category) {
        throw new AppError("Category not found", 404, ErrorCode.NOT_FOUND);
      }
      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Get service category by ID failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateServiceCategoryByID(id: string, data: UpdateServiceCategoryDTO) {
    try {
      const updated = await this.categoryRepository.updateServiceCategoryByID(
        id,
        data,
      );
      await invalidateMany([
        CacheKeys.publicCategories(),
        CacheKeys.publicCategory(updated.slug),
        CacheKeys.publicServices(),
        CacheKeys.publicServices(updated.slug),
      ]);
      return updated;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Category not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Update service category failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteServiceCategoryByID(data: ServiceCategoryIdParamDTO) {
    try {
      const deleted =
        await this.categoryRepository.deleteServiceCategoryByID(data);
      await invalidateMany([
        CacheKeys.publicCategories(),
        CacheKeys.publicCategory(deleted.slug),
        CacheKeys.publicServices(),
        CacheKeys.publicServices(deleted.slug),
      ]);
      return deleted;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Category not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Delete service category failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
