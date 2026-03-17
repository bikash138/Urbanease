export { env } from "./env";
import { prisma } from "../../db";
import { logger } from "../lib/logger";

export async function connectDB(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to database");
    process.exit(1);
  }
}
