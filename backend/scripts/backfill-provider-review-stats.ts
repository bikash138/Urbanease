/**
 * One-off backfill: set averageRating + reviewCount for given providers.
 * Run from backend/: `bun run scripts/backfill-provider-review-stats.ts`
 * (DATABASE_URL must be set).
 */
import { prisma } from "../db";
import { refreshProviderReviewStats } from "../src/utils/refreshProviderReviewStats";

const PROVIDER_IDS: string[] = [
  // "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  // "ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj",
];

if (PROVIDER_IDS.length === 0) {
  console.error("Add at least one id to PROVIDER_IDS in this script.");
  process.exit(1);
}

await Promise.all(
  PROVIDER_IDS.map((providerId) => refreshProviderReviewStats(providerId)),
);

console.log(`Done. Refreshed ${PROVIDER_IDS.length} provider profile(s).`);
await prisma.$disconnect();
