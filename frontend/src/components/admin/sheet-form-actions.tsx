import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SheetFormActionsProps {
  isPending: boolean;
  onCancel: () => void;
  submitLabel?: string;
  pendingLabel?: string;
  /** Use "destructive" variant for the submit button, e.g. reject actions */
  destructive?: boolean;
  submitIcon?: React.ReactNode;
}

export function SheetFormActions({
  isPending,
  onCancel,
  submitLabel = "Save",
  pendingLabel = "Saving...",
  destructive = false,
  submitIcon,
}: SheetFormActionsProps) {
  return (
    <div className="flex gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant={destructive ? "destructive" : "default"}
        className="flex-1"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {pendingLabel}
          </>
        ) : (
          <>
            {submitIcon && <span className="mr-2">{submitIcon}</span>}
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
}
