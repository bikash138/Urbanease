import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
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
      return await this.serviceRepository.createService(data);
    } catch (error) {
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
      return await this.serviceRepository.updateServiceByID(id, data);
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
      return await this.serviceRepository.deleteServiceByID(data);
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
