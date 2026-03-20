import { Router } from "express";
import profileRouter from "./profile/profile.routes";
import servicesRouter from "./services/services.routes";
import areasRouter from "./areas/areas.routes";
import reviewsRouter from "./reviews/reviews.routes";
import bookingsRouter from "./bookings/bookings.routes";
import uploadRouter from "./upload/upload.routes";
import statsRouter from "./stats/stats.routes";

const providerRouter = Router();

providerRouter.use("/stats", statsRouter);
providerRouter.use("/profile", profileRouter);
providerRouter.use("/services", servicesRouter);
providerRouter.use("/areas", areasRouter);
providerRouter.use("/reviews", reviewsRouter);
providerRouter.use("/bookings", bookingsRouter);
providerRouter.use("/upload", uploadRouter);

export default providerRouter;
