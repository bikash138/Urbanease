import axios from "axios";
import { config } from "./config";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
