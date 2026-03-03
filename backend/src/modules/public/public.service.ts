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
}
