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
    console.log(error);
    const message = error?.response?.data?.message ?? "Something went wrong";
    const statusCode = error?.response?.status ?? 500;
    return Promise.reject({ message, statusCode });
  },
);

export default apiClient;
