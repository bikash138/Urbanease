import { Router } from "express";
import { CustomerReviewHandler } from "./reviews.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { createReviewSchema, updateReviewSchema } from "./reviews.validation";

const reviewsRouter = Router();
const reviewHandler = new CustomerReviewHandler();

reviewsRouter.use(authMiddleware, roleMiddleware("CUSTOMER"));

reviewsRouter.post(
  "/",
  validateRequest(createReviewSchema),
  reviewHandler.createReview,
);
reviewsRouter.get("/", reviewHandler.getAllReviews);
reviewsRouter.put(
  "/:id",
  validateRequest(updateReviewSchema),
  reviewHandler.updateReview,
);
reviewsRouter.delete("/:id", reviewHandler.deleteReview);

export default reviewsRouter;
