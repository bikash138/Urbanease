import { tokenStorage } from "@/lib/token";
import { AuthorizedUser } from "@/types/auth.types";
import { create } from "zustand";

interface AuthState {
  user: AuthorizedUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
interface AuthActions {
  setAuth: (user: AuthorizedUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  token: tokenStorage.get(),
  isAuthenticated: !!tokenStorage.get(),

  setAuth(user, token) {
    tokenStorage.set(token);
    set({ user, token, isAuthenticated: true });
  },

  clearAuth() {
    tokenStorage.clear();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
