import { Router } from "express";
import profileRouter from "./profile/profile.routes";
import addressesRouter from "./addresses/addresses.routes";
import bookingsRouter from "./bookings/bookings.routes";
import reviewsRouter from "./reviews/reviews.routes";

const customerRouter = Router();

customerRouter.use("/profile", profileRouter);
customerRouter.use("/addresses", addressesRouter);
customerRouter.use("/bookings", bookingsRouter);
customerRouter.use("/reviews", reviewsRouter);

export default customerRouter;
