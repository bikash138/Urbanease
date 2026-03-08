"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AddressFormValues } from "./types";

interface AddressFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: AddressFormValues;
  onSubmit: (values: AddressFormValues) => void;
  isPending: boolean;
  error: string | null;
}

const DEFAULT_VALUES: AddressFormValues = {
  label: "HOME",
  street: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export function AddressFormSheet({
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
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? DEFAULT_VALUES);
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
