import { Prisma } from "../../../../generated/prisma/client";
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

  async getReviews(providerId: string, query: ReviewStatusQueryDTO) {
    try {
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

  async flagReview(providerId: string, reviewId: string) {
    try {
      // Check the review exists and belongs to this provider before flagging
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { id: true, providerId: true, status: true },
      });

      if (!review || review.providerId !== providerId) {
        throw new AppError("Review not found", 404, ErrorCode.NOT_FOUND);
      }

      if (review.status === "FLAGGED") {
        throw new AppError(
          "Review is already flagged",
          409,
          ErrorCode.CONFLICT,
        );
      }

      return await this.reviewsRepository.flagReview(reviewId, providerId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Review not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to flag review",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
