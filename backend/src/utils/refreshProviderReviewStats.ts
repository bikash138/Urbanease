import { prisma } from "../../db";


export async function refreshProviderReviewStats(providerId: string) {
  const agg = await prisma.review.aggregate({
    where: {
      providerId,
      status: {
        in: ["FLAGGED", "VISIBLE"],
      },
    },
    _avg: {
      rating: true,
    },
    _count: { _all: true },
  });

  const count = agg._count._all;
  await prisma.providerProfile.update({
    where: {
      id: providerId,
    },
    data: {
      reviewCount: count,
      averageRating: count === 0 ? null : agg._avg.rating,
    },
  });
}
