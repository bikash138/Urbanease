import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { AdminReviewRepository } from "./review.repository";
import type { UpdateReviewStatusDTO } from "./review.validation";
import { prisma } from "../../../../db";

export class AdminReviewService {
  private reviewRepository: AdminReviewRepository;

  constructor() {
    this.reviewRepository = new AdminReviewRepository();
  }

  async getAllFlaggedReviews() {
    try {
      return await this.reviewRepository.getAllFlaggedReviews();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch flagged reviews",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFlaggedReviews(providerServiceId: string) {
    try {
      const providerService = await prisma.providerService.findUnique({
        where: { id: providerServiceId },
        select: { id: true },
      });

      if (!providerService) {
        throw new AppError(
          "Provider service not found",
          404,
          ErrorCode.NOT_FOUND,
        );
      }

      return await this.reviewRepository.getFlaggedReviews(providerServiceId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch flagged reviews",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateReviewStatus(reviewId: string, data: UpdateReviewStatusDTO) {
    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { id: true, status: true },
      });

      if (!review) {
        throw new AppError("Review not found", 404, ErrorCode.NOT_FOUND);
      }

      return await this.reviewRepository.updateReviewStatus(reviewId, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to update review status",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteReview(reviewId: string) {
    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        select: { id: true },
      });

      if (!review) {
        throw new AppError("Review not found", 404, ErrorCode.NOT_FOUND);
      }

      return await this.reviewRepository.deleteReview(reviewId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to delete review",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
