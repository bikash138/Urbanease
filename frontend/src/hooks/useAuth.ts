"use client";

import { extractErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  adminSigninAPI,
  signinAPI,
  signoutAPI,
  signupAPI,
} from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type {
  AdminSigninFormValues,
  SigninFormValues,
} from "@/schemas/auth.schema";
import type { SignupFormValues } from "@/schemas/auth.schema";
import type { UserRole } from "@/types/auth.types";

function getRedirectUrl(role: UserRole, callbackUrl?: string): string {
  const safeCallback =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//");
  if (safeCallback) return callbackUrl;
  if (role === "ADMIN") return "/admin";
  if (role === "PROVIDER") return "/provider";
  return "/";
}

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function redirectByRole(role: UserRole, callbackUrl?: string) {
    const url = getRedirectUrl(role, callbackUrl);
    window.location.href = url;
  }

  async function signin(
    data: SigninFormValues,
    options?: { callbackUrl?: string },
  ) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signinAPI(data);
      toast.success(response.message ?? "Signed in successfully");
      setAuth(
        response.data.user,
        response.data.user.role,
        response.data.accessToken,
      );
      redirectByRole(response.data.user.role, options?.callbackUrl);
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(
    data: SignupFormValues,
    options?: { callbackUrl?: string },
  ) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signupAPI(data);
      toast.success(response.message ?? "Account created successfully");
      setAuth(
        response.data.user,
        response.data.user.role,
        response.data.accessToken,
      );
      redirectByRole(response.data.user.role, options?.callbackUrl);
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function adminSignin(data: AdminSigninFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminSigninAPI(data);
      toast.success(response.message ?? "Admin signed in successfully");
      setAuth(
        response.data.user,
        response.data.user.role,
        response.data.accessToken,
      );
      redirectByRole(response.data.user.role);
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout(options?: { redirectTo?: string }) {
    const redirectUrl = options?.redirectTo ?? "/";
    try {
      await signoutAPI();
      await new Promise((resolve) => setTimeout(resolve, 150));
      toast.success("Signed out successfully");
    } catch {
      toast.error("Error while signing out");
    } finally {
      clearAuth();
      router.push(redirectUrl);
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signin,
    signup,
    logout,
    adminSignin,
  };
}
