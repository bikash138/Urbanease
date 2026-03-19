import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../../lib/redis";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.types";
import { env } from "../../config";

const generalLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "general_limit",
  points: 50,
  duration: 1,
});

const authLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "auth_limit",
  points: 5,
  duration: 60 * 10,
});

const searchLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "search_limit",
  points: 8,
  duration: 60,
});

const uploadLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "upload_limit",
  points: 10,
  duration: 60 * 60,
});

const actionLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "action_limit",
  points: 20,
  duration: 60 * 60,
});

const createRateLimitMiddleware = (limiter: RateLimiterRedis) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (env.NODE_ENV !== "production") {
      return next();
    }
    limiter
      .consume(req.user?.id || req.ip!)
      .then(() => {
        next();
      })
      .catch((rejRes) => {
        if (rejRes.msBeforeNext !== undefined) {
          const seconds = Math.round(rejRes.msBeforeNext / 1000) || 1;
          const message =
            seconds > 60
              ? `Retry after ${Math.ceil(seconds / 60)} minutes`
              : `Retry after ${seconds} seconds`;
          return next(new AppError(message, 429, ErrorCode.RATE_LIMIT_REACHED));
        }
        return next(
          new AppError(
            "Critical internal service unavailable",
            500,
            ErrorCode.INTERNAL_SERVER_ERROR,
          ),
        );
      });
  };
};

export const generalRateLimit = createRateLimitMiddleware(generalLimiter);
export const authRateLimit = createRateLimitMiddleware(authLimiter);
export const searchRateLimit = createRateLimitMiddleware(searchLimiter);
export const uploadRateLimit = createRateLimitMiddleware(uploadLimiter);
export const actionRateLimit = createRateLimitMiddleware(actionLimiter);
