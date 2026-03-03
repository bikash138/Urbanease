import { Router } from "express";
import { ReviewsHandler } from "./reviews.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";

const reviewsRouter = Router();
const reviewsHandler = new ReviewsHandler();

reviewsRouter.use(authMiddleware, roleMiddleware("PROVIDER"));

reviewsRouter.get("/", reviewsHandler.getReviews);

export default reviewsRouter;
