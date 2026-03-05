import apiClient from "@/lib/api-client";
import { CustomerProfilePayload, CustomerProfileResponse } from "@/types/customer/customer-profile.types";

export async function createCustomerProfileAPI(
  payload: CustomerProfilePayload
): Promise<CustomerProfileResponse> {
  return apiClient.post("/customer/profile", payload);
}
