"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useAuth } from "@/hooks/useAuth";

interface LogoutConfirmModalProps {
  /** The element that triggers the modal (e.g. a button or menu item) */
  trigger: React.ReactNode;
  /** Where to redirect after logout. Defaults to /auth/signin */
  redirectTo?: string;
}

export function LogoutConfirmModal({
  trigger,
  redirectTo = "/",
}: LogoutConfirmModalProps) {
  const { logout } = useAuth();

  const handleConfirm = () => {
    logout({ redirectTo });
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
