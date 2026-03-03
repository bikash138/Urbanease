import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { CustomerProfileRepository } from "./profile.repository";

export class CustomerProfileService {
  private profileRepository: CustomerProfileRepository;

  constructor() {
    this.profileRepository = new CustomerProfileRepository();
  }

  async createProfile(userId: string) {
    try {
      return await this.profileRepository.createProfile(userId);
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
      const profile = await this.profileRepository.getProfile(userId);
      if (!profile) {
        throw new AppError("Profile not found", 404, ErrorCode.NOT_FOUND);
      }
      return profile;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch profile",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
