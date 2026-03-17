import { env, connectDB } from "./config";
import app from "./app";
import http from "http";
import { prisma } from "../db";
import { disconnectRedis, connectRedis } from "./lib/redis";
import { logger } from "./lib/logger";

async function start() {
  await connectRedis();
  await connectDB();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Urbanease backend is up and running at PORT:${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });

  async function shutdown(signal: string) {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    setTimeout(() => {
      logger.error("Timeout reached, some request may drop");
      process.exit(1);
    }, 10_000);
    server.close(async (error) => {
      if (error) {
        logger.error({ err: error }, "Error while closing server");
        process.exit(1);
      }
      logger.info("Server closed, no more incoming requests");
      try {
        await prisma.$disconnect();
        logger.info("Database disconnected");
      } catch (e) {
        logger.error({ err: e }, "Error while disconnecting database");
      }
      await disconnectRedis();
      logger.info("Shutdown complete");
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
start().catch((error) => {
  logger.error({ err: error }, "App Startup Failed: ");
  process.exit(1);
});
