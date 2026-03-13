import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { invalidateMany } from "../../../lib/cache";
import { CacheKeys } from "../../../lib/cache-keys";
import { ServiceRepository } from "./service.repository";
import type {
  CreateServiceSchemaDTO,
  ServiceIdParamDTO,
  UpdateServiceSchemaDTO,
} from "./service.validation";

export class ServiceService {
  private serviceRepository: ServiceRepository;

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  async addService(data: CreateServiceSchemaDTO) {
    try {
      const service = await this.serviceRepository.createService(data);
      await invalidateMany([
        CacheKeys.publicServices(),
        CacheKeys.publicServices(service.category.slug),
        CacheKeys.publicCategory(service.category.slug),
      ]);
      return service;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        if (error.code === "P2002") {
          throw new AppError(
            "A service with this title or slug already exists",
            409,
            ErrorCode.CONFLICT,
          );
        }
        if (error.code === "P2003") {
          throw new AppError("Category not found", 404, ErrorCode.NOT_FOUND);
        }
      }
      throw new AppError(
        "Service creation failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllServices() {
    try {
      return await this.serviceRepository.getAllServices();
    } catch (error) {
      throw new AppError(
        "Get all services failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getServiceByID(data: ServiceIdParamDTO) {
    try {
      const service = await this.serviceRepository.getServiceByID(data);
      if (!service) {
        throw new AppError("Service not found", 404, ErrorCode.NOT_FOUND);
      }
      return service;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Get service by ID failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateServiceByID(id: string, data: UpdateServiceSchemaDTO) {
    try {
      const updated = await this.serviceRepository.updateServiceByID(id, data);
      await invalidateMany([
        CacheKeys.publicService(updated.slug),
        CacheKeys.publicServices(),
        CacheKeys.publicServices(updated.category.slug),
        CacheKeys.publicCategory(updated.category.slug),
      ]);
      return updated;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Service not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Update service failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteServiceByID(data: ServiceIdParamDTO) {
    try {
      const deleted = await this.serviceRepository.deleteServiceByID(data);
      await invalidateMany([
        CacheKeys.publicService(deleted.slug),
        CacheKeys.publicServices(),
        CacheKeys.publicServices(deleted.category.slug),
        CacheKeys.publicCategory(deleted.category.slug),
      ]);
      return deleted;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Service not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Delete service failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
