"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signinAPI, signupAPI } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type { SigninFormValues } from "@/schemas/auth.schema";
import type { SignupFormValues } from "@/schemas/auth.schema";
import type { UserRole } from "@/types/auth.types";

export function useAuth() {
  const router = useRouter();
  const { setAuth, clearAuth, user, token, isAuthenticated } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function redirectByRole(role: UserRole) {
    if (role === "ADMIN") router.push("/admin");
    else if (role === "PROVIDER") router.push("/provider");
    else router.push("/customer");
  }

  function extractErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null && "message" in err) {
      return (err as { message: string }).message;
    }
    return "Something went wrong. Please try again.";
  }

  async function signin(data: SigninFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signinAPI(data);
      setAuth(response.user, response.token);
      redirectByRole(response.user.role);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(data: SignupFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      await signupAPI(data);
      // Don't auto-login after signup — send to signin with a success flag
      router.push("/auth/signin?registered=true");
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    clearAuth();
    router.push("/auth/signin");
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    signin,
    signup,
    logout,
  };
}
