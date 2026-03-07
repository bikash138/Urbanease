import apiClient from "@/lib/api-client";
import type {
  CreateBookingPayload,
  RescheduleBookingPayload,
  CustomerBookingListResponse,
  CustomerBookingDetailResponse,
  CustomerBookingActionResponse,
  RescheduleBookingResponse,
} from "@/types/customer/customer-booking.types";

export async function getCustomerBookingsAPI(
  status?: string,
): Promise<CustomerBookingListResponse> {
  const params = status ? `?status=${status}` : "";
  return apiClient.get(`/customer/bookings${params}`);
}

export async function getCustomerBookingByIDAPI(
  id: string,
): Promise<CustomerBookingDetailResponse> {
  return apiClient.get(`/customer/bookings/${id}`);
}

export async function createBookingAPI(
  payload: CreateBookingPayload,
): Promise<CustomerBookingActionResponse> {
  return apiClient.post("/customer/bookings", payload);
}

export async function cancelCustomerBookingAPI(
  id: string,
): Promise<CustomerBookingActionResponse> {
  return apiClient.patch(`/customer/bookings/${id}/cancel`, {});
}

export async function rescheduleBookingAPI(
  id: string,
  payload: RescheduleBookingPayload,
): Promise<RescheduleBookingResponse> {
  return apiClient.patch(`/customer/bookings/${id}/reschedule`, payload);
}
