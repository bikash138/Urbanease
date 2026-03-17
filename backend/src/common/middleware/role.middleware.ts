import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.types";
import { logger } from "../../lib/logger";

type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export const roleMiddleware =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError("Authentication required", 401, ErrorCode.UNAUTHORIZED),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn({ role: req.user.role }, "Forbidden: role not allowed");
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403,
          ErrorCode.FORBIDDEN,
        ),
      );
    }

    next();
  };
