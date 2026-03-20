import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ProviderBookingService } from "./bookings.service";
import type { Request, Response } from "express";

export class ProviderBookingHandler {
  private bookingService: ProviderBookingService;

  constructor() {
    this.bookingService = new ProviderBookingService();
  }

  getAllBookings = asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const bookings = await this.bookingService.getAllBookings(
      req.providerId!,
      status,
    );
    res.status(200).json({ success: true, data: bookings });
  });

  getBookingByID = asyncHandler(async (req: Request, res: Response) => {
    const booking = await this.bookingService.getBookingByID(
      req.providerId!,
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: booking });
  });

  confirmBooking = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.bookingService.confirmBooking(
      req.providerId!,
      req.params.id as string,
    );
    res
      .status(200)
      .json({ success: true, data: result, message: "Booking confirmed" });
  });

  startBooking = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.bookingService.startBooking(
      req.providerId!,
      req.params.id as string,
    );
    res
      .status(200)
      .json({ success: true, data: result, message: "Booking started" });
  });

  completeBooking = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.bookingService.completeBooking(
      req.providerId!,
      req.params.id as string,
    );
    res
      .status(200)
      .json({ success: true, data: result, message: "Booking completed" });
  });

  cancelBooking = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.bookingService.cancelBooking(
      req.providerId!,
      req.params.id as string,
    );
    res
      .status(200)
      .json({ success: true, data: result, message: "Booking cancelled" });
  });

  addNote = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.bookingService.addNote(
      req.providerId!,
      req.params.id as string,
      req.body,
    );
    res
      .status(200)
      .json({
        success: true,
        data: result,
        message: "Note added successfully",
      });
  });

  addImage = asyncHandler(async (req: Request, res: Response) => {
    const image = await this.bookingService.addImage(
      req.providerId!,
      req.params.id as string,
      req.body,
    );
    res
      .status(201)
      .json({
        success: true,
        data: image,
        message: "Image added successfully",
      });
  });

  getImages = asyncHandler(async (req: Request, res: Response) => {
    const images = await this.bookingService.getImages(
      req.providerId!,
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: images });
  });

  deleteImage = asyncHandler(async (req: Request, res: Response) => {
    await this.bookingService.deleteImage(
      req.providerId!,
      req.params.imgId as string,
    );
    res.status(200).json({ success: true, message: "Image deleted" });
  });
}
