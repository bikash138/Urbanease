import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import { config } from "./config";
import { tokenStorage } from "./token";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const API_VERSION = "/api/v1";

const ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED";

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  const url = `${config.apiBaseUrl}${API_VERSION}/auth/refresh`;
  const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
    url,
    {},
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    },
  );
  if (!data?.success || !data.data?.accessToken) {
    throw new Error(data?.message ?? "Refresh failed");
  }
  tokenStorage.set(data.data.accessToken);
}

function queueRefresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function isAuthRefreshPath(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("/auth/refresh");
}

/** Login/signup/refresh calls — 401 here must not hard-redirect (e.g. wrong password). */
function isPublicAuthApiPath(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("/auth/signin") ||
    url.includes("/auth/signup") ||
    url.includes("/auth/admin-signin") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password") ||
    url.includes("/auth/refresh")
  );
}

function redirectToSignIn(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/auth/signin")) return;
  const callback =
    window.location.pathname +
    (window.location.search || "") +
    (window.location.hash || "");
  const target = new URL("/auth/signin", window.location.origin);
  if (callback && !callback.startsWith("/auth/signin")) {
    target.searchParams.set("callbackUrl", callback);
  }
  window.location.assign(target.toString());
}

const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((req) => {
  const token = tokenStorage.get();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const body = error.response?.data as
      | { errorCode?: string; message?: string }
      | undefined;
    const errorCode = body?.errorCode;

    if (
      status === 401 &&
      errorCode === ACCESS_TOKEN_EXPIRED &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRefreshPath(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        await queueRefresh();
        return apiClient.request(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        redirectToSignIn();
        return Promise.reject({
          message: "Session expired. Please sign in again.",
          errorCode: "SESSION_EXPIRED",
          statusCode: 401,
        });
      }
    }

    // Other 401s: missing/invalid access token, etc. — not ACCESS_TOKEN_EXPIRED (handled above).
    // Skip login/signup/refresh so wrong password does not reload the app.
    if (
      status === 401 &&
      !isPublicAuthApiPath(originalRequest?.url) &&
      !(
        errorCode === ACCESS_TOKEN_EXPIRED &&
        originalRequest &&
        !originalRequest._retry
      )
    ) {
      useAuthStore.getState().clearAuth();
      redirectToSignIn();
    }

    const statusCode = status ?? 500;
    if (body?.message) {
      const message = body.message;
      const code = body.errorCode;
      const displayMessage = code ? `${code}: ${message}` : message;
      return Promise.reject({
        message: displayMessage,
        errorCode: code,
        statusCode,
      });
    }

    if (!error.response) {
      return Promise.reject({
        message: "Connection failed. The server may be unavailable.",
        statusCode: 0,
      });
    }

    return Promise.reject({
      message: "Something went wrong",
      statusCode,
    });
  },
);

export default apiClient;
