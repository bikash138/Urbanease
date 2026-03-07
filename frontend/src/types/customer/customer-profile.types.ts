import { ApiResponse } from "@/lib/api-client";

export interface CustomerAddress {
  id: string;
  label: "HOME" | "WORK" | "OTHER";
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  customerId: string;
}

export interface CustomerProfileData {
  id: string;
  userId: string;
  addresses: CustomerAddress[];
}

export type CustomerProfileResponse = ApiResponse<CustomerProfileData>;
