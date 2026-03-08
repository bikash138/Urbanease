"use client";

import { MapPin, Plus } from "lucide-react";

import type { CustomerAddress } from "@/types/customer/customer-profile.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { AddressCard } from "./AddressCard";

interface ProfileAddressesSectionProps {
  addresses: CustomerAddress[] | undefined;
  isLoading: boolean;
  isDeleting: boolean;
  isSettingDefault: boolean;
  onAddAddress: () => void;
  onEditAddress: (address: CustomerAddress) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
}

export function ProfileAddressesSection({
  addresses,
  isLoading,
  isDeleting,
  isSettingDefault,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}: ProfileAddressesSectionProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-900">Saved Addresses</CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Manage your delivery and service addresses
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1.5" onClick={onAddAddress}>
            <Plus className="size-4" />
            Add Address
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-5">
        {isLoading ? (
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
            <Button size="sm" variant="outline" className="mt-4 gap-1.5" onClick={onAddAddress}>
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
                onEdit={onEditAddress}
                onDelete={onDeleteAddress}
                onSetDefault={onSetDefaultAddress}
                isDeleting={isDeleting}
                isSettingDefault={isSettingDefault}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
