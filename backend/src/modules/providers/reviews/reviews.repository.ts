import { prisma } from "../../../../db";
import type { ReviewStatusQueryDTO } from "./reviews.validation";

export class ReviewsRepository {
  async getReviews(providerId: string, query: ReviewStatusQueryDTO) {
    return await prisma.review.findMany({
      where: {
        providerId,
        ...(query.status && { status: query.status }),
      },
      include: {
        customer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async flagReview(reviewId: string, providerId: string) {
    return await prisma.review.update({
      where: { id: reviewId, providerId },
      data: { status: "FLAGGED" },
      select: {
        id: true,
        status: true,
        rating: true,
        comment: true,
        updatedAt: true,
      },
    });
  }
}
