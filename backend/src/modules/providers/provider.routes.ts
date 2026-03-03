import { Router } from "express";
import profileRouter from "./profile/profile.routes";
import servicesRouter from "./services/services.routes";
import reviewsRouter from "./reviews/reviews.routes";
import bookingsRouter from "./bookings/bookings.routes";

const providerRouter = Router();

providerRouter.use("/profile", profileRouter);
providerRouter.use("/services", servicesRouter);
providerRouter.use("/reviews", reviewsRouter);
providerRouter.use("/bookings", bookingsRouter);

export default providerRouter;
