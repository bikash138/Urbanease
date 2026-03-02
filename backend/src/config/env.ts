import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(4, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid or Missing ENV variables:\n");
  parsed.error.issues.forEach((err) => {
    console.error(`   • [${err.path.join(".")}] -> ${err.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
