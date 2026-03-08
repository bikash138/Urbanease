"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ADDRESS_ICON } from "./utils";
import type { CustomerAddress } from "@/types/customer/customer-profile.types";

interface AddressSelectorProps {
  addresses: CustomerAddress[] | undefined;
  isLoading: boolean;
  selectedAddress: CustomerAddress | null;
  onSelect: (address: CustomerAddress) => void;
}

export function AddressSelector({
  addresses,
  isLoading,
  selectedAddress,
  onSelect,
}: AddressSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-zinc-400" />
          Service Address
        </h2>
        <Link
          href="/customer/profile"
          className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Manage
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto">
            <MapPin className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-xs text-zinc-500">No saved addresses</p>
          <Link href="/customer/profile">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs"
            >
              Add Address
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => {
            const { label, icon: Icon } = ADDRESS_ICON[addr.label];
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <button
                key={addr.id}
                onClick={() => onSelect(addr)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-900"
                    : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-3.5 h-3.5 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}
                  />
                  <span
                    className={`text-xs font-semibold ${isSelected ? "text-zinc-200" : "text-zinc-700"}`}
                  >
                    {label}
                  </span>
                  {addr.isDefault && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/15 text-zinc-300" : "bg-zinc-100 text-zinc-500"}`}
                    >
                      Default
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs leading-relaxed ${isSelected ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
