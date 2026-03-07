"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { MapPin, Plus, ChevronDown, Pencil, Trash2, Star } from "lucide-react";

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
  AddressLabel,
} from "@/types/customer/customer-address.types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const LABEL_CONFIG: Record<AddressLabel, { label: string; className: string }> = {
  HOME: { label: "Home", className: "bg-blue-100 text-blue-700 border-blue-200" },
  WORK: { label: "Work", className: "bg-amber-100 text-amber-700 border-amber-200" },
  OTHER: { label: "Other", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

// ── Address Form ─────────────────────────────────────────────────────────────

interface AddressFormValues {
  label: AddressLabel;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface AddressFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: AddressFormValues;
  onSubmit: (values: AddressFormValues) => void;
  isPending: boolean;
  error: string | null;
}

function AddressFormSheet({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSubmit,
  isPending,
  error,
}: AddressFormSheetProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: defaultValues ?? {
      label: "HOME",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        defaultValues ?? {
          label: "HOME",
          street: "",
          city: "",
          state: "",
          pincode: "",
          isDefault: false,
        },
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleOpenChange(val: boolean) {
    if (!val) reset();
    onOpenChange(val);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-2">
          <SheetTitle>{mode === "create" ? "Add New Address" : "Edit Address"}</SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Fill in the details to add a new delivery address."
              : "Update the address details below."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="address-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-4 pb-2 space-y-4"
        >
          {/* Label */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 font-medium">Address Type</Label>
            <Controller
              name="label"
              control={control}
              rules={{ required: "Address type is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOME">Home</SelectItem>
                    <SelectItem value="WORK">Work</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.label && (
              <p className="text-xs text-red-600">{errors.label.message}</p>
            )}
          </div>

          {/* Street */}
          <div className="space-y-1.5">
            <Label htmlFor="street" className="text-slate-700 font-medium">
              Street Address
            </Label>
            <Input
              id="street"
              placeholder="e.g. 42 Baker Street, Apt 3B"
              {...register("street", { required: "Street address is required" })}
            />
            {errors.street && (
              <p className="text-xs text-red-600">{errors.street.message}</p>
            )}
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-slate-700 font-medium">
                City
              </Label>
              <Input
                id="city"
                placeholder="e.g. Mumbai"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-xs text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-slate-700 font-medium">
                State
              </Label>
              <Input
                id="state"
                placeholder="e.g. Maharashtra"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && (
                <p className="text-xs text-red-600">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Pincode */}
          <div className="space-y-1.5">
            <Label htmlFor="pincode" className="text-slate-700 font-medium">
              Pincode
            </Label>
            <Input
              id="pincode"
              placeholder="e.g. 400001"
              className="w-40"
              {...register("pincode", { required: "Pincode is required" })}
            />
            {errors.pincode && (
              <p className="text-xs text-red-600">{errors.pincode.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </form>

        <SheetFooter className="border-t border-border/60 pt-4">
          <SheetClose asChild>
            <Button variant="outline" size="sm" type="button" disabled={isPending}>
              Cancel
            </Button>
          </SheetClose>
          <Button size="sm" type="submit" form="address-form" disabled={isPending}>
            {isPending ? "Saving..." : mode === "create" ? "Add Address" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Address Card ──────────────────────────────────────────────────────────────

interface AddressCardProps {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: AddressCardProps) {
  const [expanded, setExpanded] = useState(false);
  const labelCfg = LABEL_CONFIG[address.label];

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <MapPin className="size-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-800 truncate">
              {address.street}, {address.city}
            </span>
            <Badge
              variant="secondary"
              className={cn("text-xs font-medium border shrink-0", labelCfg.className)}
            >
              {labelCfg.label}
            </Badge>
            {address.isDefault && (
              <Badge
                variant="secondary"
                className="text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0"
              >
                Default
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {address.state} — {address.pincode}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "size-4 text-slate-400 shrink-0 transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>

      {/* Expanded details */}
      {expanded && (
        <>
          <Separator />
          <div className="bg-slate-50/60 px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Street</p>
                <p className="text-slate-700">{address.street}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">City</p>
                <p className="text-slate-700">{address.city}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">State</p>
                <p className="text-slate-700">{address.state}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Pincode</p>
                <p className="text-slate-700">{address.pincode}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 flex-wrap">
              {!address.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={() => onSetDefault(address.id)}
                  disabled={isSettingDefault}
                >
                  <Star className="size-3" />
                  Set as Default
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => onEdit(address)}
              >
                <Pencil className="size-3" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                onClick={() => onDelete(address.id)}
                disabled={isDeleting}
              >
                <Trash2 className="size-3" />
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────

export default function CustomerProfilePage() {
  const { user } = useAuthStore();

  const { data: profile, isLoading: profileLoading } = useCustomerProfile();
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

  function handleDelete(id: string) {
    deleteAddress.mutate(id);
  }

  function handleSetDefault(id: string) {
    setDefaultAddress.mutate(id);
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "C";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="w-full space-y-6">

        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm">Manage your account and saved addresses</p>
        </div>

        {/* Identity card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl select-none shrink-0">
                {profileLoading ? (
                  <Skeleton className="h-16 w-16 rounded-full" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0 flex-1">
                {profileLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-900 truncate">
                      {user?.name ?? "Customer"}
                    </h2>
                    <p className="text-slate-500 text-sm truncate">{user?.email}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-900">Saved Addresses</CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  Manage your delivery and service addresses
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setFormError(null);
                  setCreateSheetOpen(true);
                }}
              >
                <Plus className="size-4" />
                Add Address
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">
            {addressesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-border/60 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !addresses || addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <MapPin className="size-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">No addresses saved yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Add an address to get started with bookings
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 gap-1.5"
                  onClick={() => {
                    setFormError(null);
                    setCreateSheetOpen(true);
                  }}
                >
                  <Plus className="size-4" />
                  Add your first address
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={handleEditOpen}
                    onDelete={handleDelete}
                    onSetDefault={handleSetDefault}
                    isDeleting={deleteAddress.isPending}
                    isSettingDefault={setDefaultAddress.isPending}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create address sheet */}
      <AddressFormSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        mode="create"
        onSubmit={handleCreateSubmit}
        isPending={createAddress.isPending}
        error={formError}
      />

      {/* Edit address sheet */}
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
