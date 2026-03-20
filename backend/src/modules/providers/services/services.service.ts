import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { ServicesRepository } from "./services.repository";
import type { AddServiceDTO, UpdateServiceDTO } from "./services.validation";
import { Prisma } from "../../../../generated/prisma/client";
import { prisma } from "../../../../db";
import { invalidateMany } from "../../../lib/cache";
import { CacheKeys } from "../../../lib/cache-keys";

export class ServicesService {
  private servicesRepository: ServicesRepository;

  constructor() {
    this.servicesRepository = new ServicesRepository();
  }

  private async invalidatePublicCachesAfterServiceMutation(
    providerId: string,
    providerSlug?: string,
    catalogServiceSlug?: string,
  ) {
    let resolvedProviderSlug = providerSlug;
    if (resolvedProviderSlug === undefined) {
      const profile = await prisma.providerProfile.findUnique({
        where: { id: providerId },
        select: { slug: true },
      });
      resolvedProviderSlug = profile?.slug;
    }
    const keys = [CacheKeys.publicProvider()];
    if (resolvedProviderSlug) {
      keys.push(CacheKeys.publicProvider(resolvedProviderSlug));
    }
    if (catalogServiceSlug) {
      keys.push(CacheKeys.publicService(catalogServiceSlug));
    }
    await invalidateMany(keys);
  }

  private async getProvider(providerId: string) {
    const profile = await prisma.providerProfile.findUnique({
      where: { id: providerId },
    });
    if (!profile)
      throw new AppError(
        "Provider profile not found. Please create one.",
        404,
        ErrorCode.NOT_FOUND,
      );
    return profile;
  }

  async addService(providerId: string, data: AddServiceDTO) {
    try {
      const provider = await this.getProvider(providerId);
      const service = await this.servicesRepository.addService(
        providerId,
        data,
      );
      await this.servicesRepository.createSlotsForProvider(provider.slug);
      await this.invalidatePublicCachesAfterServiceMutation(
        providerId,
        provider.slug,
        service.service.slug,
      );
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

  async getAllServices(providerId: string) {
    try {
      return await this.servicesRepository.getAllServices(providerId);
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
    providerId: string,
    providerServiceId: string,
    data: UpdateServiceDTO,
  ) {
    try {
      const service = await this.servicesRepository.updateService(
        providerId,
        providerServiceId,
        data,
      );
      await this.invalidatePublicCachesAfterServiceMutation(
        providerId,
        undefined,
        service.service.slug,
      );
      return service;
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

  async removeService(providerId: string, providerServiceId: string) {
    try {
      const { id, catalogServiceSlug } =
        await this.servicesRepository.removeService(
          providerId,
          providerServiceId,
        );
      await this.invalidatePublicCachesAfterServiceMutation(
        providerId,
        undefined,
        catalogServiceSlug,
      );
      return { id };
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
