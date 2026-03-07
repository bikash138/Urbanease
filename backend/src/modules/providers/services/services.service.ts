import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { ServicesRepository } from "./services.repository";
import type { AddServiceDTO, UpdateServiceDTO } from "./services.validation";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../db";

export class ServicesService {
  private servicesRepository: ServicesRepository;

  constructor() {
    this.servicesRepository = new ServicesRepository();
  }

  private async getProvider(userId: string) {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new AppError(
        "Provider profile not found. Please create one.",
        404,
        ErrorCode.NOT_FOUND,
      );
    return profile;
  }

  async addService(userId: string, data: AddServiceDTO) {
    try {
      const provider = await this.getProvider(userId);
      const service = await this.servicesRepository.addService(
        provider.id,
        data,
      );
      await this.servicesRepository.createSlotsForProvider(provider.slug);
      return service;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Service already added by this provider",
          409,
          ErrorCode.CONFLICT,
        );
      }
      throw new AppError(
        "Failed to add service",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllServices(userId: string) {
    try {
      const provider = await this.getProvider(userId);
      return await this.servicesRepository.getAllServices(provider.id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch services",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateService(
    userId: string,
    providerServiceId: string,
    data: UpdateServiceDTO,
  ) {
    try {
      const provider = await this.getProvider(userId);
      return await this.servicesRepository.updateService(
        provider.id,
        providerServiceId,
        data,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          "Service not found or unauthorized",
          404,
          ErrorCode.NOT_FOUND,
        );
      }
      throw new AppError(
        "Failed to update service",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeService(userId: string, providerServiceId: string) {
    try {
      const provider = await this.getProvider(userId);
      return await this.servicesRepository.removeService(
        provider.id,
        providerServiceId,
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          "Service not found or unauthorized",
          404,
          ErrorCode.NOT_FOUND,
        );
      }
      throw new AppError(
        "Failed to remove service",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
