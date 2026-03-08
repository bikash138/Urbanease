"use client";

import { asyncHandler } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminSigninAPI, signinAPI, signoutAPI, signupAPI } from "@/api/auth.api";
import { createProviderProfileAPI } from "@/api/provider/provider-profile.api";
import { useAuthStore } from "@/store/auth.store";
import type {
  AdminSigninFormValues,
  SigninFormValues,
} from "@/schemas/auth.schema";
import type { SignupFormValues } from "@/schemas/auth.schema";
import type { UserRole } from "@/types/auth.types";
import { createCustomerProfileAPI } from "@/api/customer/customer-profile.api";

function getRedirectUrl(role: UserRole, callbackUrl?: string): string {
  const safeCallback =
    callbackUrl &&
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//");
  if (safeCallback) return callbackUrl;
  if (role === "ADMIN") return "/admin";
  if (role === "PROVIDER") return "/provider/profile";
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
    return asyncHandler(
      async () => {
        const response = await signinAPI(data);
        setAuth(response.data.user, response.data.user.role, response.data.token);
        redirectByRole(response.data.user.role, options?.callbackUrl);
      },
      setError,
      setIsLoading,
    );
  }

  async function signup(
    data: SignupFormValues,
    options?: { callbackUrl?: string },
  ) {
    return asyncHandler(
      async () => {
        const response = await signupAPI(data);
        if (response.success) {
          const r = await signinAPI({
            email: data.email,
            password: data.password,
          });
          const role = r.data.user.role;
          setAuth(r.data.user, role);

          if (role === "PROVIDER") {
            await createProviderProfileAPI({});
          } else if (role === "CUSTOMER") {
            await createCustomerProfileAPI();
          } else {
            router.push("/admin-signin");
          }
          redirectByRole(role, options?.callbackUrl);
        }
      },
      setError,
      setIsLoading,
    );
  }

  async function adminSignin(data: AdminSigninFormValues) {
    return asyncHandler(
      async () => {
        const response = await adminSigninAPI(data);
        setAuth(response.data.user, response.data.user.role, response.data.token);
        redirectByRole(response.data.user.role);
      },
      setError,
      setIsLoading,
    );
  }

  async function logout() {
    try {
      await signoutAPI();
    } catch {
      // proceed even if server call fails
    }
    finally{
      clearAuth();
      router.push("/");
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
