import apiClient from "@/lib/api-client";
import {
  BookingStatus,
  BookingListResponse,
  BookingDetailResponse,
  BookingActionResponse,
  BookingCancelResponse,
  BookingNoteResponse,
  BookingImageResponse,
  BookingImagesResponse,
  DeleteBookingImageResponse,
  AddNotePayload,
  AddImagePayload,
} from "@/types/provider/provider-booking.types";

// ── Queries ────────────────────────────────────────────────────────

/** GET /provider/bookings?status=... — pass no status to fetch all */
export async function getAllProviderBookingsAPI(
  status?: BookingStatus,
): Promise<BookingListResponse> {
  return apiClient.get("/provider/bookings", {
    params: status ? { status } : undefined,
  });
}

/** GET /provider/bookings/:id */
export async function getProviderBookingByIdAPI(
  id: string,
): Promise<BookingDetailResponse> {
  return apiClient.get(`/provider/bookings/${id}`);
}

/** GET /provider/bookings/:id/images */
export async function getProviderBookingImagesAPI(
  id: string,
): Promise<BookingImagesResponse> {
  return apiClient.get(`/provider/bookings/${id}/images`);
}

// ── Status actions ─────────────────────────────────────────────────

/** PATCH /provider/bookings/:id/confirm — PENDING → CONFIRMED */
export async function confirmProviderBookingAPI(
  id: string,
): Promise<BookingActionResponse> {
  return apiClient.patch(`/provider/bookings/${id}/confirm`);
}

/** PATCH /provider/bookings/:id/start — CONFIRMED → IN_PROGRESS */
export async function startProviderBookingAPI(
  id: string,
): Promise<BookingActionResponse> {
  return apiClient.patch(`/provider/bookings/${id}/start`);
}

/** PATCH /provider/bookings/:id/complete — IN_PROGRESS → COMPLETED */
export async function completeProviderBookingAPI(
  id: string,
): Promise<BookingActionResponse> {
  return apiClient.patch(`/provider/bookings/${id}/complete`);
}

/** PATCH /provider/bookings/:id/cancel — PENDING | CONFIRMED → CANCELLED */
export async function cancelProviderBookingAPI(
  id: string,
): Promise<BookingCancelResponse> {
  return apiClient.patch(`/provider/bookings/${id}/cancel`);
}

// ── Notes & images ─────────────────────────────────────────────────

/** PATCH /provider/bookings/:id/note */
export async function addProviderBookingNoteAPI(
  id: string,
  payload: AddNotePayload,
): Promise<BookingNoteResponse> {
  return apiClient.patch(`/provider/bookings/${id}/note`, payload);
}

/** POST /provider/bookings/:id/images */
export async function addProviderBookingImageAPI(
  id: string,
  payload: AddImagePayload,
): Promise<BookingImageResponse> {
  return apiClient.post(`/provider/bookings/${id}/images`, payload);
}

/** DELETE /provider/bookings/:id/images/:imgId */
export async function deleteProviderBookingImageAPI(
  id: string,
  imgId: string,
): Promise<DeleteBookingImageResponse> {
  return apiClient.delete(`/provider/bookings/${id}/images/${imgId}`);
}
