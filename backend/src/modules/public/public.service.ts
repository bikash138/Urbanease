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

  async getCategoryByID(id: string) {
    try {
      return await this.publicRepository.getCategoryByID(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          `Category with id: ${id} not found`,
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

  async getServiceByID(id: string) {
    try {
      return await this.publicRepository.getServiceByID(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          `Service with id: ${id} not found`,
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

  async getProviderByID(id: string) {
    try {
      return await this.publicRepository.getProviderByID(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError(
          `Provider with id: ${id} not found`,
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
    providerId: string,
    serviceId: string,
    dateString: string,
  ) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + 3);

      const requestedDate = new Date(dateString);
      requestedDate.setHours(0, 0, 0, 0);

      if (requestedDate < tomorrow) {
        throw new AppError(
          "Same-day bookings are not allowed. Minimum 1 day advance",
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      if (requestedDate > tomorrow) {
        throw new AppError(
          "You can only view slots up to 3 days in advance",
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      const slots = await this.publicRepository.getAvailableSlots(
        providerId,
        serviceId,
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
