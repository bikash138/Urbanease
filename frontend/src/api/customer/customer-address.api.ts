import apiClient from "@/lib/api-client";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
  AddressResponse,
  AddressesResponse,
  DeleteAddressResponse,
} from "@/types/customer/customer-address.types";

export async function getAddressesAPI(): Promise<AddressesResponse> {
  return apiClient.get("/customer/addresses");
}

export async function createAddressAPI(
  payload: CreateAddressPayload,
): Promise<AddressResponse> {
  return apiClient.post("/customer/addresses", payload);
}

export async function updateAddressAPI(
  id: string,
  payload: UpdateAddressPayload,
): Promise<AddressResponse> {
  return apiClient.put(`/customer/addresses/${id}`, payload);
}

export async function deleteAddressAPI(id: string): Promise<DeleteAddressResponse> {
  return apiClient.delete(`/customer/addresses/${id}`);
}

export async function setDefaultAddressAPI(id: string): Promise<AddressResponse> {
  return apiClient.patch(`/customer/addresses/${id}/default`, {});
}
