import { asyncHandler } from "../../../common/utils/asyncHandler";
import { BookingService } from "./bookings.service";
import type { Request, Response } from "express";

export class BookingHandler {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  createBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.createBooking(
      req.user!.id,
      req.body,
    );
    res
      .status(201)
      .json({
        success: true,
        data: booking,
        message: "Booking created successfully",
      });
  });

  getAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const bookings = await this.bookingService.getAllBookings(
      req.user!.id,
      status,
    );
    res.status(200).json({ success: true, data: bookings });
  });

  getBookingByID = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.getBookingByID(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: booking });
  });

  cancelBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.cancelBooking(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({
      success: true,
      data: booking,
      message: "Booking cancelled successfully",
    });
  });

  rescheduleBooking = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.rescheduleBooking(
      req.user!.id,
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      data: booking,
      message: "Booking rescheduled successfully",
    });
  });
}
