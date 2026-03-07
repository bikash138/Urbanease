import { prisma } from "../../../../db";
import type { UpdateReviewStatusDTO } from "./review.validation";

export class AdminReviewRepository {
  async getAllFlaggedReviews() {
    return await prisma.review.findMany({
      where: { status: "FLAGGED" },
      select: {
        id: true,
        rating: true,
        comment: true,
        status: true,
        customer: { select: { id: true, name: true } },
        provider: { select: { id: true, user: { select: { name: true } } } },
        booking: { select: { id: true, date: true, providerServiceId: true, providerService: { select: { service: { select: { title: true } } } } } },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getFlaggedReviews(providerServiceId: string) {
    return await prisma.review.findMany({
      where: {
        status: "FLAGGED",
        provider: {
          servicesOffered: {
            some: { id: providerServiceId },
          },
        },
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        status: true,
        customer: {
          select: { id: true, name: true },
        },
        provider: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
        booking: {
          select: {
            id: true,
            date: true,
            providerServiceId: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async updateReviewStatus(reviewId: string, data: UpdateReviewStatusDTO) {
    return await prisma.review.update({
      where: { id: reviewId },
      data: { status: data.status },
      select: {
        id: true,
        status: true,
        rating: true,
        comment: true,
        updatedAt: true,
      },
    });
  }

  async deleteReview(reviewId: string) {
    return await prisma.review.delete({
      where: { id: reviewId },
      select: { id: true },
    });
  }
}
