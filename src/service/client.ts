import axios from "axios";

function getDefaultApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:8080/api/v1";
  }

  const { hostname, origin } = window.location;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

  if (isLocalHost) {
    return "http://localhost:8080/api/v1";
  }

  return `${origin}/api/v1`;
}

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = (envApiBaseUrl || getDefaultApiBaseUrl()).replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: apiBaseUrl,
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

export interface BackendResponse<T> {
  status: number;
  message: string;
  data: T;
  errors: Record<string, unknown>;
  timestamp: string;
}

export async function wrapResponse<T>(
  promise: Promise<{ data: T }>,
): Promise<ApiResponse<T>> {
  const { data } = await promise;
  return { data, errors: [] };
}

export { apiClient };
