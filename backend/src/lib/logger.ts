import pino from "pino";
import { pinoHttp } from "pino-http";
import type { Request } from "express";
import { env } from "../config";

const isDev = env.NODE_ENV !== "production";

function getRequestPath(req: Request): string {
  return (
    req.originalUrl ??
    (req.headers["x-original-url"] as string) ??
    (req.headers["x-forwarded-path"] as string) ??
    req.url ??
    "/"
  );
}

export const logger = pino({
  level: isDev ? "debug" : "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:HH:MM:ss",
      ignore: "responseTime, requestId",
    },
  },
});

export function createHttpLogger() {
  return pinoHttp({
    logger,
    genReqId: (req: Request) =>
      req.requestId ?? req.headers["x-request-id"] ?? crypto.randomUUID(),
    customSuccessMessage: (req, res, responseTime) =>
      `${req.method} ${getRequestPath(req)} ${res.statusCode} ${responseTime}ms`,
    serializers: {
      req: () => undefined,
      res: () => undefined,
    },
  });
}
