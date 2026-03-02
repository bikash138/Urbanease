import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.types";

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
