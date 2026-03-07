import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { ProviderBookingRepository } from "./bookings.repository";
import { prisma } from "../../../../db";
import type { AddImageDTO, AddNoteDTO } from "./bookings.validation";

export class ProviderBookingService {
  private bookingRepository: ProviderBookingRepository;

  constructor() {
    this.bookingRepository = new ProviderBookingRepository();
  }

  private async getProviderId(userId: string) {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new AppError(
        "Provider profile not found",
        404,
        ErrorCode.NOT_FOUND,
      );
    }
    return profile.id;
  }

  // ─── Check booking exists and belongs to provider ────
  private async guardBooking(providerId: string, bookingId: string) {
    const booking = await this.bookingRepository.findBooking(
      providerId,
      bookingId,
    );
    if (!booking) {
      throw new AppError("Booking not found", 404, ErrorCode.NOT_FOUND);
    }
    return booking;
  }

  async getAllBookings(userId: string, status?: string) {
    try {
      const providerId = await this.getProviderId(userId);
      return await this.bookingRepository.getAllBookings(providerId, status);
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
      const providerId = await this.getProviderId(userId);
      const booking = await this.bookingRepository.getBookingByID(
        providerId,
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

  // ─── Status Change ───

  async confirmBooking(userId: string, bookingId: string) {
    try {
      const providerId = await this.getProviderId(userId);
      const booking = await this.guardBooking(providerId, bookingId);

      if (booking.status !== "PENDING") {
        throw new AppError(
          `Cannot confirm a booking that is ${booking.status}`,
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      await this.bookingRepository.updateBookingStatus(
        providerId,
        bookingId,
        "CONFIRMED",
      );
      return { id: bookingId, status: "CONFIRMED" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to confirm booking",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async startBooking(userId: string, bookingId: string) {
    try {
      const providerId = await this.getProviderId(userId);
      const booking = await this.guardBooking(providerId, bookingId);

      if (booking.status !== "CONFIRMED") {
        throw new AppError(
          `Cannot start a booking that is ${booking.status}`,
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      const hasBeforeImage = await this.bookingRepository.hasImageOfType(
        providerId,
        bookingId,
        "BEFORE",
      );
      if (!hasBeforeImage) {
        throw new AppError(
          "Upload a before image before starting the service",
          400,
          ErrorCode.VALIDATION_ERROR,
        );
      }

      await this.bookingRepository.updateBookingStatus(
        providerId,
        bookingId,
        "IN_PROGRESS",
        { startedAt: new Date() },
      );
      return { id: bookingId, status: "IN_PROGRESS" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to start booking",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async completeBooking(userId: string, bookingId: string) {
    try {
      const providerId = await this.getProviderId(userId);
      const booking = await this.guardBooking(providerId, bookingId);

      if (booking.status !== "IN_PROGRESS") {
        throw new AppError(
          `Cannot complete a booking that is ${booking.status}`,
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      const hasAfterImage = await this.bookingRepository.hasImageOfType(
        providerId,
        bookingId,
        "AFTER",
      );
      if (!hasAfterImage) {
        throw new AppError(
          "Upload an after image before marking the service as complete",
          400,
          ErrorCode.VALIDATION_ERROR,
        );
      }

      await this.bookingRepository.updateBookingStatus(
        providerId,
        bookingId,
        "COMPLETED",
        { completedAt: new Date() },
      );
      return { id: bookingId, status: "COMPLETED" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to complete booking",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelBooking(userId: string, bookingId: string) {
    try {
      const providerId = await this.getProviderId(userId);
      const booking = await this.guardBooking(providerId, bookingId);

      if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
        throw new AppError(
          `Cannot cancel a booking that is ${booking.status}`,
          400,
          ErrorCode.FORBIDDEN,
        );
      }

      await this.bookingRepository.updateBookingStatus(
        providerId,
        bookingId,
        "CANCELLED",
      );
      return { id: bookingId, status: "CANCELLED" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to cancel booking",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─── Note & Images ─────

  async addNote(userId: string, bookingId: string, data: AddNoteDTO) {
    try {
      const providerId = await this.getProviderId(userId);
      await this.guardBooking(providerId, bookingId);
      await this.bookingRepository.addNote(providerId, bookingId, data);
      return { id: bookingId, providerNote: data.providerNote };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to add note",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addImage(userId: string, bookingId: string, data: AddImageDTO) {
    try {
      const providerId = await this.getProviderId(userId);
      await this.guardBooking(providerId, bookingId);
      return await this.bookingRepository.addImage(providerId, bookingId, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to add image",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImages(userId: string, bookingId: string) {
    try {
      const providerId = await this.getProviderId(userId);
      await this.guardBooking(providerId, bookingId);
      return await this.bookingRepository.getImages(providerId, bookingId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch images",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(userId: string, imageId: string) {
    try {
      const providerId = await this.getProviderId(userId);
      return await this.bookingRepository.deleteImage(providerId, imageId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Image not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to delete image",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
