import type { AddressLabel } from "@/types/customer/customer-address.types";

export interface AddressFormValues {
  label: AddressLabel;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}
