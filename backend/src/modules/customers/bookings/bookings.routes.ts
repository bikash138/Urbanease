import { Router } from "express";
import { BookingHandler } from "./bookings.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import {
  createBookingSchema,
  rescheduleBookingSchema,
} from "./bookings.validation";

import { actionRateLimit } from "../../../common/middleware/rate-limiter.middleware";

const bookingsRouter = Router();
const bookingHandler = new BookingHandler();

bookingsRouter.use(authMiddleware, roleMiddleware("CUSTOMER"), actionRateLimit);

bookingsRouter.post(
  "/",
  validateRequest(createBookingSchema),
  bookingHandler.createBooking,
);
bookingsRouter.get("/", bookingHandler.getAllBookings);
bookingsRouter.get("/:id", bookingHandler.getBookingByID);
bookingsRouter.patch("/:id/cancel", bookingHandler.cancelBooking);
bookingsRouter.patch(
  "/:id/reschedule",
  validateRequest(rescheduleBookingSchema),
  bookingHandler.rescheduleBooking,
);

export default bookingsRouter;
