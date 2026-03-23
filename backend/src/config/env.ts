import { z } from "zod";

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Redis / Valkey (caching, rate limiting, etc.)
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  // Frontend (CORS origin, password-reset redirect base URL)
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),

  // Auth: JWT and opaque tokens
  JWT_ACCESS_SECRET: z.string().min(4, "JWT_ACCESS_SECRET is required"),
  REFRESH_TOKEN_SECRET: z.string().min(4, "REFRESH_TOKEN_SECRET is required"),
  PASSWORD_RESET_SECRET: z.string().min(1, "PASSWORD_RESET_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("30m"),
  /** Refresh token & cookie lifetime in days (integer). */
  REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().int().positive().default(7),

  // Auth: cookies
  COOKIE_DOMAIN: z.string().optional(),

  // Auth: admin sign-in
  ADMIN_KEY: z.string().min(1, "ADMIN_KEY is required"),

  // AWS (S3 uploads)
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  AWS_ENDPOINT_URL_S3: z.string().min(1, "AWS_ENDPOINT_URL_S3 is required"),
  AWS_ENDPOINT_URL_IAM: z.string().min(1, "AWS_ENDPOINT_URL_IAM is required"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  S3_BUCKET_NAME: z.string().min(1, "S3_BUCKET_NAME is required"),

  // Email Resend
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),
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
