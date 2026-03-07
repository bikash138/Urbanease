import { prisma } from "../../../../db";
import type { CreateReviewDTO, UpdateReviewDTO } from "./reviews.validation";

export class CustomerReviewRepository {
  async createReview(
    userId: string,
    providerId: string,
    data: CreateReviewDTO,
  ) {
    const data1 = await prisma.review.create({
      data: {
        customerId: userId,
        providerId,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        status: true,
        provider: { select: { user: { select: { name: true } } } },
        createdAt: true,
      },
    });
    return data1;
  }

  async getAllReviews(customerId: string) {
    return await prisma.review.findMany({
      where: { customerId },
      select: {
        id: true,
        rating: true,
        comment: true,
        status: true,
        booking: { select: { id: true, date: true } },
        provider: { select: { id: true, user: { select: { name: true } } } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateReview(
    customerId: string,
    reviewId: string,
    data: UpdateReviewDTO,
  ) {
    return await prisma.review.update({
      where: { id: reviewId, customerId, NOT: { status: "HIDDEN" } },
      data: {
        rating: data.rating,
        comment: data.comment,
      },
      select: { id: true, rating: true, comment: true },
    });
  }

  async deleteReview(customerId: string, reviewId: string) {
    return await prisma.review.update({
      where: { id: reviewId, customerId, NOT: { status: "HIDDEN" } },
      data: { status: "HIDDEN" },
      select: { id: true },
    });
  }
}
