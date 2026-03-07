import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { ProfileRepository } from "./profile.repository";
import type { CreateProfileDTO, UpdateProfileDTO } from "./profile.validation";
import { Prisma } from "../../../../generated/prisma/client";
import {createUserSlug} from "../../../common/utils/slug-generator"

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async createProfile(userId: string, data: CreateProfileDTO) {
    try {
      return await this.profileRepository.createProfile(userId, data);
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

  async getProfile(userId: string) {
    try {
      return await this.profileRepository.getProfile(userId);
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

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    try {
      return await this.profileRepository.updateProfile(userId, data);
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
