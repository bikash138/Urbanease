import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { BookingRepository } from "./bookings.repository";
import { prisma } from "../../../../db";
import type { CreateBookingDTO } from "./bookings.validation";

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  private async getCustomerProfileId(userId: string) {
    const profile = await prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new AppError(
        "Customer profile not found. Please create one first.",
        404,
        ErrorCode.NOT_FOUND,
      );
    }
    return profile.id;
  }

  async createBooking(userId: string, data: CreateBookingDTO) {
    try {
      const customerId = await this.getCustomerProfileId(userId);

      const providerService = await prisma.providerService.findUnique({
        where: { id: data.providerServiceId },
        include: {
          provider: { select: { id: true, status: true } },
          service: { select: { id: true } },
        },
      });

      if (!providerService || !providerService.isAvailable) {
        throw new AppError(
          "This service is currently unavailable",
          400,
          ErrorCode.NOT_FOUND,
        );
      }
      if (providerService.provider.status !== "APPROVED") {
        throw new AppError(
          "This provider is not approved",
          400,
          ErrorCode.NOT_FOUND,
        );
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + 3);

      const requestedDate = new Date(data.date);
      requestedDate.setHours(0, 0, 0, 0);

      if (requestedDate < tomorrow) {
        throw new AppError(
          "Same-day bookings are not allowed. Book at least 1 day in advance.",
          400,
          ErrorCode.FORBIDDEN,
        );
      }
      if (requestedDate > maxDate) {
        throw new AppError(
          "You cannot book more than 3 days in advance.",
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      const slot = await prisma.slot.findFirst({
        where: {
          id: data.slotId,
          serviceId: providerService.service.id, // ✅ now available
          isActive: true,
        },
      });
      if (!slot) {
        throw new AppError(
          "Invalid or inactive slot for this service",
          400,
          ErrorCode.NOT_FOUND,
        );
      }

      const unavailability = await prisma.providerUnavailability.findUnique({
        where: {
          providerId_slotId_date: {
            providerId: providerService.provider.id, // ✅ now available
            slotId: data.slotId,
            date: requestedDate,
          },
        },
      });
      if (unavailability) {
        throw new AppError(
          "Provider is unavailable for this slot on the selected date.",
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      return await this.bookingRepository.createBooking(customerId, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "This slot is already booked for the selected date.",
          409,
          ErrorCode.CONFLICT,
        );
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new AppError(
          "Invalid providerServiceId or addressId",
          404,
          ErrorCode.NOT_FOUND,
        );
      }
      throw new AppError(
        "Failed to create booking",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllBookings(userId: string, status?: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.bookingRepository.getAllBookings(customerId, status);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch bookings",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBookingByID(userId: string, bookingId: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      const booking = await this.bookingRepository.getBookingByID(
        customerId,
        bookingId,
      );
      if (!booking) {
        throw new AppError("Booking not found", 404, ErrorCode.NOT_FOUND);
      }
      return booking;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch booking",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelBooking(userId: string, bookingId: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);

      // Only PENDING or CONFIRMED bookings can be cancelled
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId, customerId },
        select: { status: true },
      });
      if (!booking) {
        throw new AppError("Booking not found", 404, ErrorCode.NOT_FOUND);
      }
      if (
        booking.status === "COMPLETED" ||
        booking.status === "IN_PROGRESS" ||
        booking.status === "CANCELLED"
      ) {
        throw new AppError(
          `Cannot cancel a booking that is ${booking.status}`,
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      return await this.bookingRepository.cancelBooking(customerId, bookingId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to cancel booking",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
