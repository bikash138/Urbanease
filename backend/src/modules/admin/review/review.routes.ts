import { Router } from "express";
import { AdminReviewHandler } from "./review.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { updateReviewStatusSchema } from "./review.validation";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";

const reviewRouter = Router();
const reviewHandler = new AdminReviewHandler();

reviewRouter.use(authMiddleware, roleMiddleware("ADMIN"));

reviewRouter.get("/", reviewHandler.getAllFlaggedReviews);

reviewRouter.get(
  "/by-service",
  (req, res, next) => {
    if (!req.query.providerServiceId) {
      return next(
        new AppError(
          "providerServiceId query param is required",
          400,
          ErrorCode.VALIDATION_ERROR,
        ),
      );
    }
    return next();
  },
  reviewHandler.getFlaggedReviews,
);

reviewRouter.patch(
  "/:id/status",
  validateRequest(updateReviewStatusSchema),
  reviewHandler.updateReviewStatus,
);

reviewRouter.delete("/:id", reviewHandler.deleteReview);

export default reviewRouter;
