"use client";

import { MapPin, ChevronDown, Pencil, Trash2, Star } from "lucide-react";

import type { CustomerAddress } from "@/types/customer/customer-profile.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { LABEL_CONFIG } from "./constants";

interface AddressCardProps {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: AddressCardProps) {
  const labelCfg = LABEL_CONFIG[address.label];

  return (
    <Collapsible className="border border-border/60 rounded-xl overflow-hidden">
      <CollapsibleTrigger asChild>
        <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50/80 transition-colors group"
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

            <ChevronDown className="size-4 text-slate-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
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
      </CollapsibleContent>
    </Collapsible>
  );
}
