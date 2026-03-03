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
}
