import type { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
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
  const accessToken =
    req.cookies?.access_token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!accessToken) {
    return next(new AppError("Access Token not found", 401, ErrorCode.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as {
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
    if (error instanceof TokenExpiredError) {
      return next(
        new AppError(
          "Access token expired",
          401,
          ErrorCode.ACCESS_TOKEN_EXPIRED,
        ),
      );
    }
    return next(
      new AppError("Invalid access token", 401, ErrorCode.UNAUTHORIZED),
    );
  }
};
