import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../../common/errors/app.error";
import { ErrorCode } from "../../common/errors/error.types";
import { PublicRepository } from "./public.repository";

export class PublicService {
  private publicRepository: PublicRepository;

  constructor() {
    this.publicRepository = new PublicRepository();
  }

  async getAllCategories() {
    try {
      return await this.publicRepository.getAllCategories();
    } catch (error) {
      throw new AppError(
        "Failed to fetch categories",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCategoryBySlug(slug: string) {
    try {
      return await this.publicRepository.getCategoryBySlug(slug);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          `Category with slug: ${slug} not found`,
          404,
          ErrorCode.NOT_FOUND,
        );
      }
      throw new AppError(
        "Failed to fetch category",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllServices(categoryId?: string) {
    try {
      return await this.publicRepository.getAllServices(categoryId);
    } catch (error) {
      throw new AppError(
        "Failed to fetch services",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getServiceBySlug(slug: string) {
    try {
      return await this.publicRepository.getServiceBySlug(slug);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          `Service with slug: ${slug} not found`,
          404,
          ErrorCode.NOT_FOUND,
        );
      }
      throw new AppError(
        "Failed to fetch service",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProviders() {
    try {
      return await this.publicRepository.getAllProviders();
    } catch (error) {
      throw new AppError(
        "Failed to fetch providers",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProviderBySlug(slug: string) {
    try {
      return await this.publicRepository.getProviderBySlug(slug);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          `Provider with slug: ${slug} not found`,
          404,
          ErrorCode.NOT_FOUND,
        );
      }
      throw new AppError(
        "Failed to fetch provider",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAvailableSlots(
    providerSlug: string,
    // serviceSlug: string,
    dateString: string,
  ) {
    try {
      const now = new Date();
      const todayUTC = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );

      const tomorrow = new Date(todayUTC);
      tomorrow.setUTCDate(todayUTC.getUTCDate() + 1);

      const maxDate = new Date(todayUTC);
      maxDate.setUTCDate(todayUTC.getUTCDate() + 4);

      const requestedDate = new Date(dateString + "T00:00:00.000Z");

      if (requestedDate < tomorrow) {
        throw new AppError(
          "Same-day bookings are not allowed. Minimum 1 day advance",
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      if (requestedDate > maxDate) {
        throw new AppError(
          "You can only view slots up to 3 days in advance",
          400,
          ErrorCode.FORBIDDEN,
        );
      }
      const slots = await this.publicRepository.getAvailableSlots(
        providerSlug,
        requestedDate,
      );
      return slots;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch slots",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPublicReviews(providerId?: string) {
    try {
      return await this.publicRepository.getPublicReviews(providerId);
    } catch (error) {
      throw new AppError(
        "Failed to fetch reviews",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
