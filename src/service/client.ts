import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  data: T;
  errors: ApiError[];
}

export async function wrapResponse<T>(
  promise: Promise<{ data: T }>,
): Promise<ApiResponse<T>> {
  const { data } = await promise;
  return { data, errors: [] };
}

export { apiClient };
