import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { CustomerReviewRepository } from "./reviews.repository";
import { prisma } from "../../../../db";
import type { CreateReviewDTO, UpdateReviewDTO } from "./reviews.validation";

export class CustomerReviewService {
  private reviewRepository: CustomerReviewRepository;

  constructor() {
    this.reviewRepository = new CustomerReviewRepository();
  }

  private async getCustomerProfileId(userId: string) {
    const profile = await prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new AppError(
        "Customer profile not found",
        404,
        ErrorCode.NOT_FOUND,
      );
    }
    return profile.id;
  }

  async createReview(userId: string, data: CreateReviewDTO) {
    try {
      
      const customerId = await this.getCustomerProfileId(userId);

      // Booking must exist, belong to this customer, and be COMPLETED
      const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId, customerId },
        select: {
          status: true,
          providerService: { select: { providerId: true } },
        },
      });

      if (!booking) {
        throw new AppError("Booking not found", 404, ErrorCode.NOT_FOUND);
      }
      if (booking.status !== "COMPLETED") {
        throw new AppError(
          "You can only review a completed booking",
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      // Block re-review if one was previously deleted for this booking
      const existingReview = await prisma.review.findUnique({
        where: { bookingId: data.bookingId },
        select: { status: true },
      });
      if (existingReview) {
        throw new AppError(
          "You have already reviewed this booking",
          409,
          ErrorCode.CONFLICT,
        );
      }

      return await this.reviewRepository.createReview(
        userId,
        booking.providerService.providerId,
        data,
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "You have already reviewed this booking",
          409,
          ErrorCode.CONFLICT,
        );
      }
      throw new AppError(
        "Failed to submit review",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllReviews(userId: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.reviewRepository.getAllReviews(customerId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch reviews",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateReview(userId: string, reviewId: string, data: UpdateReviewDTO) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.reviewRepository.updateReview(
        customerId,
        reviewId,
        data,
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Review not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to update review",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteReview(userId: string, reviewId: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.reviewRepository.deleteReview(customerId, reviewId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Review not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to delete review",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
