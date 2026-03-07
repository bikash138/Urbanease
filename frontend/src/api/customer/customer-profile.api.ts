import apiClient from "@/lib/api-client";
import { CustomerProfileResponse } from "@/types/customer/customer-profile.types";

export async function createCustomerProfileAPI(): Promise<CustomerProfileResponse> {
  return apiClient.post("/customer/profile", {});
}

export async function getCustomerProfileAPI(): Promise<CustomerProfileResponse> {
  return apiClient.get("/customer/profile");
}
