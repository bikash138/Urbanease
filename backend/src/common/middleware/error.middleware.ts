import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.types";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`[${req.requestId}] Error:`, {
    message: error.message,
    stack: error.stack,
  });

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
    requestId: req.requestId,
  });
};
