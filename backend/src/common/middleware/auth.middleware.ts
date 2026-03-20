import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.types";
import { env } from "../../config";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "CUSTOMER" | "PROVIDER" | "ADMIN";
      };
      providerId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return next(new AppError("Token not found", 401, ErrorCode.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: "CUSTOMER" | "PROVIDER" | "ADMIN";
      providerId?: string;
    };
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    if (decoded.providerId) {
      req.providerId = decoded.providerId;
    }
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401, ErrorCode.TOKEN_EXPIRED));
  }
};
