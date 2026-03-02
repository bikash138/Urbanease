export { env } from "./env";
import { prisma } from "../../db";

export async function connectDB(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database");
    process.exit(1);
  }
}
