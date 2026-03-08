"use client";

import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
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
    <ConfirmDialog
      trigger={trigger}
      primaryText="Sign out of Urbanease?"
      secondaryText="You'll be redirected to the sign-in page. Any unsaved changes will be lost."
      primaryButtonText="Yes, sign out"
      onConfirm={handleConfirm}
      variant="logout"
    />
  );
}
