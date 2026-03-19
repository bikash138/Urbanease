import { prisma } from "../../../../db";

export class StatsRepository {
  async getProviderStats(providerId: string) {
    const [total, completedBookings, pendingBookings, earnings] =
      await Promise.all([
        prisma.booking.count({ where: { providerService: { providerId } } }),
        prisma.booking.count({
          where: { providerService: { providerId }, status: "COMPLETED" },
        }),
        prisma.booking.count({
          where: { providerService: { providerId }, status: "PENDING" },
        }),
        prisma.booking.aggregate({
          where: {
            providerService: { providerId },
            status: "COMPLETED",
          },
          _sum: {
            totalAmount: true,
          },
        }),
      ]);
		return {
      total,
      completedBookings,
      pendingBookings,
      earnings,
    };
  }
}
