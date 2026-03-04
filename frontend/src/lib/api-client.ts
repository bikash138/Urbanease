import axios from "axios";
import { config } from "./config";
import { tokenStorage } from "./token";

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type:": "application/json",
  },
});

apiClient.interceptors.request.use((requestConfig) => {
  const token = tokenStorage.get();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error?.response?.data?.message ?? "Something went wrong";
    const statusCode = error?.response?.status ?? 500;
    return Promise.reject({ message, statusCode });
  },
);

export default apiClient;
