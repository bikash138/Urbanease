import { Router } from "express";
import { ProviderBookingHandler } from "./bookings.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { addImageSchema, addNoteSchema } from "./bookings.validation";

import { actionRateLimit } from "../../../common/middleware/rate-limiter.middleware";

const bookingsRouter = Router();
const bookingHandler = new ProviderBookingHandler();

bookingsRouter.use(authMiddleware, roleMiddleware("PROVIDER"), actionRateLimit);

bookingsRouter.get("/", bookingHandler.getAllBookings);
bookingsRouter.get("/:id", bookingHandler.getBookingByID);

bookingsRouter.patch("/:id/confirm", bookingHandler.confirmBooking);
bookingsRouter.patch("/:id/start", bookingHandler.startBooking);
bookingsRouter.patch("/:id/complete", bookingHandler.completeBooking);
bookingsRouter.patch("/:id/cancel", bookingHandler.cancelBooking);

bookingsRouter.patch(
  "/:id/note",
  validateRequest(addNoteSchema),
  bookingHandler.addNote,
);

bookingsRouter.post(
  "/:id/images",
  validateRequest(addImageSchema),
  bookingHandler.addImage,
);
bookingsRouter.get("/:id/images", bookingHandler.getImages);
bookingsRouter.delete("/:id/images/:imgId", bookingHandler.deleteImage);

export default bookingsRouter;
