import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { invalidateMany } from "../../../lib/cache";
import { CacheKeys } from "../../../lib/cache-keys";
import { ProviderRepository } from "./provider.repository";
import type {
  ProviderIdParamDTO,
  ProviderStatusQueryDTO,
  RejectProviderDTO,
} from "./provider.validation";

export class ProviderService {
  private providerRepository: ProviderRepository;

  constructor() {
    this.providerRepository = new ProviderRepository();
  }

  async getAllProviders(query: ProviderStatusQueryDTO) {
    try {
      return await this.providerRepository.getAllProviders(query);
    } catch (error) {
      throw new AppError(
        "Failed to fetch providers",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProviderByID(data: ProviderIdParamDTO) {
    try {
      return await this.providerRepository.getProviderByID(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Category not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to fetch provider",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async approveProvider(data: ProviderIdParamDTO) {
    try {
      const provider =
        await this.providerRepository.approveProvider(data);
      await invalidateMany([
        CacheKeys.publicProvider(),
        CacheKeys.publicProvider(provider.slug),
      ]);
      return provider;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Provider not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to approve provider",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rejectProvider(data: ProviderIdParamDTO, body: RejectProviderDTO) {
    try {
      const provider = await this.providerRepository.rejectProvider(
        data,
        body,
      );
      await invalidateMany([
        CacheKeys.publicProvider(),
        CacheKeys.publicProvider(provider.slug),
      ]);
      return provider;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Provider not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to reject provider",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
