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

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function redirectByRole(role: UserRole) {
    if (role === "ADMIN") router.push("/admin");
    else if (role === "PROVIDER") router.push("/provider/profile");
    else router.push("/customer");
  }

  async function signin(data: SigninFormValues) {
    return asyncHandler(
      async () => {
        const response = await signinAPI(data);
        setAuth(response.data.user, response.data.user.role);
        redirectByRole(response.data.user.role);
      },
      setError,
      setIsLoading,
    );
  }

  async function signup(data: SignupFormValues) {
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
          redirectByRole(role);
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
        setAuth(response.data.user, response.data.user.role);
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
