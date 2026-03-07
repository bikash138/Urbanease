import { prisma } from "../../../../db";
import type { AddImageDTO, AddNoteDTO } from "./bookings.validation";

const bookingListSelect = {
  id: true,
  status: true,
  date: true,
  startedAt: true,
  completedAt: true,
  totalAmount: true,
  customerNote: true,
  providerNote: true,
  address: true,
  customer: {
    select: {
      user: { select: { name: true, phone: true } },
    },
  },
  providerService: {
    select: {
      service: { select: { id: true, title: true } },
    },
  },
};

export class ProviderBookingRepository {
  async getAllBookings(providerId: string, status?: string) {
    return await prisma.booking.findMany({
      where: {
        providerService: { providerId },
        ...(status && { status: status as any }),
      },
      select: {
        ...bookingListSelect,
        review: { select: { id: true, rating: true, comment: true, status: true } },
      },
      orderBy: { date: "desc" },
    });
  }

  async getBookingByID(providerId: string, bookingId: string) {
    return await prisma.booking.findFirst({
      where: {
        id: bookingId,
        providerService: { providerId },
      },
      include: {
        address: true,
        images: true,
        review: true,
        customer: {
          select: {
            user: { select: { name: true, phone: true } },
          },
        },
        providerService: {
          include: { service: true },
        },
      },
    });
  }

  async updateBookingStatus(
    providerId: string,
    bookingId: string,
    status: "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
    extraData?: { startedAt?: Date; completedAt?: Date },
  ) {
    return await prisma.booking.updateMany({
      where: {
        id: bookingId,
        providerService: { providerId },
      },
      data: { status, ...extraData },
    });
  }

  async addNote(providerId: string, bookingId: string, data: AddNoteDTO) {
    return await prisma.booking.updateMany({
      where: {
        id: bookingId,
        providerService: { providerId },
      },
      data: { providerNote: data.providerNote },
    });
  }

  async addImage(providerId: string, bookingId: string, data: AddImageDTO) {
    return await prisma.bookingImage.create({
      data: {
        bookingId,
        url: data.url,
        type: data.type,
      },
    });
  }

  async getImages(providerId: string, bookingId: string) {
    return await prisma.bookingImage.findMany({
      where: {
        bookingId,
        booking: { providerService: { providerId } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async deleteImage(providerId: string, imageId: string) {
    return await prisma.bookingImage.delete({
      where: {
        id: imageId,
        booking: { providerService: { providerId } },
      },
      select: { id: true },
    });
  }

  // Helper to check if booking belongs to provider
  async findBooking(providerId: string, bookingId: string) {
    return await prisma.booking.findFirst({
      where: {
        id: bookingId,
        providerService: { providerId },
      },
      select: { id: true, status: true },
    });
  }
}
