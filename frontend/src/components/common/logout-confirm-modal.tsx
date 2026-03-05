"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
import { useAuthStore } from "@/store/auth.store";

interface LogoutConfirmModalProps {
  /** The element that triggers the modal (e.g. a button or menu item) */
  trigger: React.ReactNode;
  /** Where to redirect after logout. Defaults to /auth/signin */
  redirectTo?: string;
}

export function LogoutConfirmModal({
  trigger,
  redirectTo = "/auth/signin",
}: LogoutConfirmModalProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleConfirm = () => {
    clearAuth();
    router.push(redirectTo);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <LogOut className="size-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg">
              Sign out of Urbanease?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm leading-relaxed">
            You'll be redirected to the sign-in page. Any unsaved changes will
            be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
