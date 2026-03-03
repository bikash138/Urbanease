import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { ReviewsRepository } from "./reviews.repository";
import type { ReviewStatusQueryDTO } from "./reviews.validation";
import { prisma } from "../../../../db";

export class ReviewsService {
  private reviewsRepository: ReviewsRepository;

  constructor() {
    this.reviewsRepository = new ReviewsRepository();
  }

  private async getProviderId(userId: string) {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new AppError(
        "Provider profile not found",
        404,
        ErrorCode.NOT_FOUND,
      );
    return profile.id;
  }

  async getReviews(userId: string, query: ReviewStatusQueryDTO) {
    try {
      const providerId = await this.getProviderId(userId);
      return await this.reviewsRepository.getReviews(providerId, query);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch reviews",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
