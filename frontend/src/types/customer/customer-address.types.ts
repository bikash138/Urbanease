import { ApiResponse } from "@/lib/api-client";
import { CustomerAddress } from "./customer-profile.types";

export type AddressLabel = "HOME" | "WORK" | "OTHER";

export interface CreateAddressPayload {
  label: AddressLabel;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  label?: AddressLabel;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export type AddressResponse = ApiResponse<CustomerAddress>;
export type AddressesResponse = ApiResponse<CustomerAddress[]>;
export type DeleteAddressResponse = ApiResponse<null>;
