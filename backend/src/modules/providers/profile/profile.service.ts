import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { ProfileRepository } from "./profile.repository";
import type { CreateProfileDTO, UpdateProfileDTO } from "./profile.validation";
import { Prisma } from "../../../../generated/prisma/client";
import { CacheTTL, getOrSet, invalidateMany } from "../../../lib/cache";
import { CacheKeys } from "../../../lib/cache-keys";

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  private async invalidateProviderCaches(providerId: string, slug: string) {
    await invalidateMany([
      CacheKeys.providerProfile(providerId),
      CacheKeys.publicProvider(),
      CacheKeys.publicProvider(slug),
    ]);
  }

  async createProfile(userId: string, data: CreateProfileDTO) {
    try {
      const profile = await this.profileRepository.createProfile(userId, data);
      await this.invalidateProviderCaches(profile.id, profile.slug);
      return profile;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError("Profile already exists", 409, ErrorCode.CONFLICT);
      }
      throw new AppError(
        "Failed to create profile",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(providerId: string) {
    try {
      return await getOrSet(
        CacheKeys.providerProfile(providerId),
        CacheTTL.PROVIDER_PROFILE,
        () => this.profileRepository.getProfile(providerId),
        { skipCacheWhen: (data) => data == null },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Profile cannot found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to fetch profile",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(providerId: string, data: UpdateProfileDTO) {
    try {
      const profile = await this.profileRepository.updateProfile(
        providerId,
        data,
      );
      await this.invalidateProviderCaches(profile.id, profile.slug);
      return profile;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Profile not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to update profile",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
