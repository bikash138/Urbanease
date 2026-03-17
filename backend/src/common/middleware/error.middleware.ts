import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.types";
import { logger } from "../../lib/logger";
import { env } from "../../config";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (env.NODE_ENV !== "production") {
    logger.error(error.message);
  } else {
    logger.error(
      { err: error, requestId: req.requestId },
      `[${req.requestId}] Error: ${error.message}`,
    );
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      errorCode: error.errorCode,
      message: error.message,
      requestId: req.requestId,
    });
  }

  return res.status(500).json({
    success: false,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
    requestId: req.requestId ?? 'no-request-id',
  });
};
