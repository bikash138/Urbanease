"use client";

import { LogOut, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type ConfirmDialogVariant = "confirm" | "alert" | "delete" | "logout";

const VARIANT_CONFIG: Record<
  ConfirmDialogVariant,
  {
    icon: React.ReactNode | null;
    iconBgClass: string;
    primaryButtonClass: string;
  }
> = {
  confirm: {
    icon: null,
    iconBgClass: "bg-primary/10",
    primaryButtonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  alert: {
    icon: <AlertTriangle className="size-5 text-orange-500" />,
    iconBgClass: "bg-orange-500/10",
    primaryButtonClass: "bg-orange-600 text-white hover:bg-orange-700",
  },
  delete: {
    icon: <Trash2 className="size-5 text-destructive" />,
    iconBgClass: "bg-destructive/10",
    primaryButtonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  logout: {
    icon: <LogOut className="size-5 text-destructive" />,
    iconBgClass: "bg-destructive/10",
    primaryButtonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
};

export interface ConfirmDialogProps {
  /** Primary text (title) */
  primaryText: string;
  /** Secondary text (description). Can include React elements. */
  secondaryText: React.ReactNode;
  /** Primary button label */
  primaryButtonText: string;
  /** Secondary button label */
  secondaryButtonText?: string;
  /** Called when primary button is clicked */
  onConfirm: () => void;
  /** Variant determines default icon and primary button styling */
  variant?: ConfirmDialogVariant;
  /** Override the default icon. When provided, shown next to title. */
  icon?: React.ReactNode;
  /** Override primary button className (e.g. for booking confirm/start/complete) */
  primaryButtonClassName?: string;
  /** Loading state for primary button */
  isPending?: boolean;
  /** Button text when isPending. When not provided, shows primaryButtonText with loader. */
  pendingButtonText?: string;
  /** Disable secondary button (e.g. while primary action is pending) */
  secondaryButtonDisabled?: boolean;
  /** For controlled usage */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** For uncontrolled usage with trigger (e.g. logout button). When provided, dialog opens via trigger. */
  trigger?: React.ReactNode;
}

export function ConfirmDialog({
  primaryText,
  secondaryText,
  primaryButtonText,
  secondaryButtonText = "Cancel",
  onConfirm,
  variant = "confirm",
  icon,
  primaryButtonClassName,
  isPending = false,
  pendingButtonText,
  secondaryButtonDisabled = false,
  open,
  onOpenChange,
  trigger,
}: ConfirmDialogProps) {
  const config = VARIANT_CONFIG[variant];
  const displayIcon = icon !== undefined ? icon : config.icon;
  const showIcon = displayIcon != null;
  const primaryClass = primaryButtonClassName ?? config.primaryButtonClass;

  const content = (
    <AlertDialogContent className="max-w-sm">
      <AlertDialogHeader>
        {showIcon ? (
          <div className="flex items-center gap-3 mb-1">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                config.iconBgClass
              )}
            >
              {displayIcon}
            </div>
            <AlertDialogTitle className="text-lg">{primaryText}</AlertDialogTitle>
          </div>
        ) : (
          <AlertDialogTitle className="text-lg">{primaryText}</AlertDialogTitle>
        )}
        <AlertDialogDescription className="text-sm leading-relaxed">
          {secondaryText}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="gap-2 sm:gap-2">
        <AlertDialogCancel
          className="flex-1"
          disabled={secondaryButtonDisabled}
        >
          {secondaryButtonText}
        </AlertDialogCancel>
        <AlertDialogAction
          className={cn("flex-1", primaryClass)}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {pendingButtonText ?? primaryButtonText}
            </>
          ) : (
            primaryButtonText
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  if (trigger != null) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        {content}
      </AlertDialog>
    );
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => onOpenChange?.(o)}
    >
      {content}
    </AlertDialog>
  );
}
