import { roleStorage, userStorage } from "@/lib/token";
import { AuthorizedUser } from "@/types/auth.types";
import { create } from "zustand";

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface AuthState {
  user: AuthorizedUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
interface AuthActions {
  setAuth: (user: AuthorizedUser, role: UserRole) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: userStorage.get(),
  isAuthenticated: !!userStorage.get(),
  role: roleStorage.get() as UserRole | null,

  setAuth(user, role) {
    userStorage.set(user);
    roleStorage.set(role);
    set({ user, isAuthenticated: true, role });
  },

  clearAuth() {
    userStorage.clear();
    roleStorage.clear();
    set({ user: null, isAuthenticated: false, role: null });
  },
}));
