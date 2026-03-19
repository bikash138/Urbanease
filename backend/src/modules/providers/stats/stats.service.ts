import { prisma } from "../../../../db";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { CacheTTL, getOrSet } from "../../../lib/cache";
import { CacheKeys } from "../../../lib/cache-keys";
import { StatsRepository } from "./stats.repository";

export class StatsService {
  private statsRepository: StatsRepository;

  constructor() {
    this.statsRepository = new StatsRepository();
  }

  private async getProviderId(userId: string) {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new AppError(
        "Provider profile not found",
        404,
        ErrorCode.NOT_FOUND,
      );
    }
    return profile.id;
  }

  async getStats(userId: string) {
    const providerId = await this.getProviderId(userId);
    return await getOrSet(
      CacheKeys.providerStats(providerId),
      CacheTTL.STATS,
      async () => {
        const { total, completedBookings, pendingBookings, earnings } =
          await this.statsRepository.getProviderStats(providerId);
        const totalEarnings = earnings._sum?.totalAmount ?? 0;
        return {
          totalBookings: total,
          completedBookings,
          pendingBookings,
          totalEarnings,
        };
      },
    );
  }
}
