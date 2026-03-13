import { env, connectDB } from "./config";
import app from "./app";
import http from "http";
import { prisma } from "../db";
import { disconnectRedis, connectRedis } from "./lib/redis";

async function start() {
  await connectRedis();
  await connectDB();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`Urbanease backend is up and running at PORT:${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });

  async function shutdown(signal: string) {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    setTimeout(() => {
      console.error("Timeout reached, some request may drop");
      process.exit(1);
    }, 10_000);
    server.close((error) => {
      if (error) {
        console.error("Error while closing server");
        process.exit(1);
      }
      console.log("Server closed");
    });
    try {
      await prisma.$disconnect();
      console.log("Database disconnected");
    } catch (error) {
      console.error("Error while disconnecting database", error);
    }
    try {
      await disconnectRedis();
    } catch (error) {
      console.error("Error while disconnecting Redis", error);
    }
    console.log("Shutdown Complete");
    process.exit(0);
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
start().catch((error) => {
  console.error("App Startup Failed: ", error);
  process.exit(1);
});
