import { CacheTTL, getOrSet } from "../../../lib/cache";
import { CacheKeys } from "../../../lib/cache-keys";
import { StatsRepository } from "./stats.repository";

export class StatsService {
  private statsRepository: StatsRepository;

  constructor() {
    this.statsRepository = new StatsRepository();
  }

  async getStats(providerId: string) {
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
