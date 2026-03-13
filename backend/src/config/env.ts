import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),
  COOKIE_DOMAIN: z.string().optional(),
  JWT_SECRET: z.string().min(4, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  ADMIN_KEY: z.string().min(1, "ADMIN_KEY is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  AWS_ENDPOINT_URL_S3: z.string().min(1, "AWS_ENDPOINT_URL_S3 is required"),
  AWS_ENDPOINT_URL_IAM: z.string().min(1, "AWS_ENDPOINT_URL_IAM is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  S3_BUCKET_NAME: z.string().min(1, "S3_BUCKET_NAME is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required")
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
