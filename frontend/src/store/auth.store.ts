import { roleStorage, tokenStorage, userStorage } from "@/lib/token";
import { AuthorizedUser } from "@/types/auth.types";
import { create } from "zustand";

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

interface AuthState {
  user: AuthorizedUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
interface AuthActions {
  setAuth: (user: AuthorizedUser, role: UserRole, token?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: userStorage.get(),
  isAuthenticated: !!userStorage.get(),
  role: roleStorage.get() as UserRole | null,

  setAuth(user, role, token) {
    userStorage.set(user);
    roleStorage.set(role);
    if (token) tokenStorage.set(token);
    set({ user, isAuthenticated: true, role });
  },

  clearAuth() {
    userStorage.clear();
    roleStorage.clear();
    tokenStorage.clear();
    set({ user: null, isAuthenticated: false, role: null });
  },
}));
