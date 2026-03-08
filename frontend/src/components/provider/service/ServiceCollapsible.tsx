"use client";

import { Pencil, Trash2, ChevronDown, ListChecks } from "lucide-react";
import type { ProviderServiceWithService } from "@/types/provider/provider-service.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ServiceCollapsibleProps {
  item: ProviderServiceWithService;
  onEdit: (item: ProviderServiceWithService) => void;
  onDelete: (item: ProviderServiceWithService) => void;
}

export function ServiceCollapsible({
  item,
  onEdit,
  onDelete,
}: ServiceCollapsibleProps) {
  return (
    <Collapsible className="border border-border/60 rounded-xl overflow-hidden">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600">
            <ListChecks className="size-4" />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground truncate">
                {item.service.title}
              </span>
              <span className="text-xs text-muted-foreground">
                ₹{item.customPrice != null ? item.customPrice.toFixed(2) : item.service.basePrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {item.isAvailable ? (
                <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-100 text-xs font-medium">
                  Available
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border border-red-200 hover:bg-red-100 text-xs font-medium">
                  Unavailable
                </Badge>
              )}
              {item.service.isActive ? (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs font-medium">
                  Active
                </Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-100 text-xs font-medium">
                  Inactive
                </Badge>
              )}
            </div>
          </div>

          <ChevronDown className="size-4 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="border-t bg-muted/30 px-4 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Base Price</p>
              <p className="font-medium">₹{item.service.basePrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Your Price</p>
              <p className="font-medium">
                {item.customPrice !== null ? (
                  <>₹{item.customPrice.toFixed(2)}</>
                ) : (
                  <span className="text-muted-foreground">— Base price</span>
                )}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Slots</p>
              <p className="text-muted-foreground text-xs">
                Morning, Afternoon, Night (auto-generated)
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-1 pt-2 border-t">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
