import { prisma } from "../../../../db";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import type { CreateBookingDTO } from "./bookings.validation";

export class BookingRepository {
  async createBooking(
    customerId: string,
    data: CreateBookingDTO,
    providerSlug: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const slot = await tx.providerSlot.findUnique({
        where: {
          id: data.slotId,
        },
      });

      if (!slot) {
        throw new AppError("Slotid not found", 401, ErrorCode.CONFLICT);
      }

      if (slot.bookedSlots >= slot.totalSlots) {
        throw new AppError("Slot full", 401, ErrorCode.FORBIDDEN);
      }

      if (slot.providerSlug !== providerSlug) {
        throw new AppError(
          "Slot does not belong to this provider",
          400,
          ErrorCode.CONFLICT,
        );
      }

      await tx.providerSlot.update({
        where: { id: slot.id },
        data: {
          bookedSlots: { increment: 1 },
        },
      });

      return await tx.booking.create({
        data: {
          customerId,
          addressId: data.addressId,
          providerServiceId: data.providerServiceId,
          slotId: slot.id,
          date: new Date(data.date),
          totalAmount: data.totalAmount,
          customerNote: data.customerNote,
        },
      });
    });
  }

  async getAllBookings(customerId: string, status?: string) {
    return await prisma.booking.findMany({
      where: {
        customerId,
        ...(status && { status: status as any }),
      },
      include: {
        providerService: {
          include: {
            service: { select: { id: true, title: true, slug: true } },
            provider: {
              select: {
                id: true,
                slug: true,
                user: { select: { name: true } },
              },
            },
          },
        },
        address: true,
        images: { select: { id: true, url: true, type: true } },
        review: {
          select: { id: true, rating: true, comment: true, status: true },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  async getBookingByID(customerId: string, bookingId: string) {
    return await prisma.booking.findUnique({
      where: { id: bookingId, customerId },
      include: {
        providerService: {
          include: {
            service: true,
            provider: {
              select: {
                id: true,
                bio: true,
                user: { select: { name: true, phone: true } },
              },
            },
          },
        },
        address: true,
        images: true,
        review: true,
      },
    });
  }

  async cancelBooking(customerId: string, bookingId: string, slotId: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.providerSlot.update({
        where: { id: slotId },
        data: { bookedSlots: { decrement: 1 } },
      });

      return await tx.booking.update({
        where: { id: bookingId, customerId },
        data: {
          status: "CANCELLED",
        },
        select: { id: true, status: true },
      });
    });
  }

  async rescheduleBooking(
    customerId: string,
    bookingId: string,
    newSlotId: string,
    newDate: Date,
    oldSlotId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      await tx.providerSlot.update({
        where: { id: oldSlotId },
        data: { bookedSlots: { decrement: 1 } },
      });

      await tx.providerSlot.update({
        where: { id: newSlotId },
        data: { bookedSlots: { increment: 1 } },
      });

      return await tx.booking.update({
        where: { id: bookingId, customerId },
        data: { slotId: newSlotId, date: newDate },
        include: {},
      });
    });
  }
}
