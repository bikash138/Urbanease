import { prisma } from "../../../../db";
import type { CreateBookingDTO } from "./bookings.validation";

export class BookingRepository {
  async createBooking(customerId: string, data: CreateBookingDTO) {
    return await prisma.booking.create({
      data: {
        customerId,
        providerServiceId: data.providerServiceId,
        addressId: data.addressId,
        slotId: data.slotId,
        date: new Date(data.date),
        totalAmount: data.totalAmount,
        customerNote: data.customerNote,
      },
      include: {
        providerService: {
          include: {
            service: { select: { id: true, title: true } },
            provider: {
              select: {
                id: true,
                user: { select: { name: true, phone: true } },
              },
            },
          },
        },
        address: true,
      },
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
            service: { select: { id: true, title: true } },
            provider: {
              select: {
                id: true,
                user: { select: { name: true } },
              },
            },
          },
        },
        address: true,
        review: { select: { id: true, rating: true } },
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

  async cancelBooking(customerId: string, bookingId: string) {
    return await prisma.booking.update({
      where: { id: bookingId, customerId },
      data: { status: "CANCELLED" },
      select: { id: true, status: true },
    });
  }
}
