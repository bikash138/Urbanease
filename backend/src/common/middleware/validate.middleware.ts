import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../errors/app.error";
import { ErrorCode } from "../errors/error.types";

export const validateRequest =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a clean, user-friendly array
        const issues = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        return next(
          new AppError(
            `Validation failed: ${issues.map((i) => i.message).join(", ")}`,
            400,
            ErrorCode.VALIDATION_ERROR,
          ),
        );
      }
      next(error);
    }
  };
