import { Router } from "express";
import { BookingHandler } from "./bookings.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { createBookingSchema } from "./bookings.validation";

const bookingsRouter = Router();
const bookingHandler = new BookingHandler();

bookingsRouter.use(authMiddleware, roleMiddleware("CUSTOMER"));

bookingsRouter.post(
  "/",
  validateRequest(createBookingSchema),
  bookingHandler.createBooking,
);
bookingsRouter.get("/", bookingHandler.getAllBookings);
bookingsRouter.get("/:id", bookingHandler.getBookingByID);
bookingsRouter.patch("/:id/cancel", bookingHandler.cancelBooking);

export default bookingsRouter;
