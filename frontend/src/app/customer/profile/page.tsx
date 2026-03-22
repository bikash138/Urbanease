"use client";

import { useState } from "react";

import { useAuthStore } from "@/store/auth.store";
import { useCustomerProfile } from "@/hooks/customer/useCustomerProfile";
import {
  useCustomerAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/customer/useCustomerAddress";
import type { CustomerAddress } from "@/types/customer/customer-profile.types";
import type {
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/types/customer/customer-address.types";

import { PageHeader } from "@/components/common/page-header";
import {
  AddressFormSheet,
  ProfileIdentityCard,
  ProfileAddressesSection,
} from "@/components/customer/profile";
import type { AddressFormValues } from "@/components/customer/profile";

export default function CustomerProfilePage() {
  const { user } = useAuthStore();

  const { isLoading: profileLoading } = useCustomerProfile();
  const { data: addresses, isLoading: addressesLoading } = useCustomerAddresses();

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function handleCreateSubmit(values: AddressFormValues) {
    setFormError(null);
    const payload: CreateAddressPayload = {
      label: values.label,
      street: values.street,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
    };
    createAddress.mutate(payload, {
      onSuccess: () => {
        setCreateSheetOpen(false);
        setFormError(null);
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to add address.";
        setFormError(msg);
      },
    });
  }

  function handleEditOpen(address: CustomerAddress) {
    setEditingAddress(address);
    setFormError(null);
    setEditSheetOpen(true);
  }

  function handleEditSubmit(values: AddressFormValues) {
    if (!editingAddress) return;
    setFormError(null);
    const payload: UpdateAddressPayload = {
      label: values.label,
      street: values.street,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
    };
    updateAddress.mutate(
      { id: editingAddress.id, payload },
      {
        onSuccess: () => {
          setEditSheetOpen(false);
          setEditingAddress(null);
          setFormError(null);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Failed to update address.";
          setFormError(msg);
        },
      },
    );
  }

  function handleAddAddress() {
    setFormError(null);
    setCreateSheetOpen(true);
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="w-full space-y-6">
        <PageHeader
          title="My Profile"
          description="Manage your account and saved addresses"
        />

        <ProfileIdentityCard
          name={user?.name ?? "Customer"}
          email={user?.email ?? ""}
          isLoading={profileLoading}
        />

        <ProfileAddressesSection
          addresses={addresses}
          isLoading={addressesLoading}
          isDeleting={deleteAddress.isPending}
          isSettingDefault={setDefaultAddress.isPending}
          onAddAddress={handleAddAddress}
          onEditAddress={handleEditOpen}
          onDeleteAddress={(id) => deleteAddress.mutate(id)}
          onSetDefaultAddress={(id) => setDefaultAddress.mutate(id)}
        />
      </div>

      <AddressFormSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        mode="create"
        onSubmit={handleCreateSubmit}
        isPending={createAddress.isPending}
        error={formError}
      />

      <AddressFormSheet
        open={editSheetOpen}
        onOpenChange={(val) => {
          setEditSheetOpen(val);
          if (!val) setEditingAddress(null);
        }}
        mode="edit"
        defaultValues={
          editingAddress
            ? {
                label: editingAddress.label,
                street: editingAddress.street,
                city: editingAddress.city,
                state: editingAddress.state,
                pincode: editingAddress.pincode,
              }
            : undefined
        }
        onSubmit={handleEditSubmit}
        isPending={updateAddress.isPending}
        error={formError}
      />
    </div>
  );
}
