import axios from "axios";
import { config } from "./config";
import { tokenStorage } from "./token";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_VERSION = "/api/v1";

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
  (error) => {
    const statusCode = error?.response?.status ?? 500;
    console.error(error);
    if (error?.response?.data?.message) {
      const message = error.response.data.message;
      const errorCode = error.response.data.errorCode;
      const displayMessage = errorCode ? `${errorCode}: ${message}` : message;
      return Promise.reject({ message: displayMessage, errorCode, statusCode });
    }

    if (!error?.response) {
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
