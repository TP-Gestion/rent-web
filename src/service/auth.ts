import { apiClient, wrapResponse, type ApiResponse } from "./client";

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  dummyToken: string;
}

const AUTH_STORAGE_KEY = "rent-web-auth";

export function getStoredAuth(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthUser;
  } catch {
    return null;
  }
}

export function saveAuth(authUser: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
}

export function clearAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function login(
  body: AuthRequest,
): Promise<ApiResponse<AuthUser>> {
  const response = await wrapResponse(apiClient.post<AuthUser>("/v1/auth/login", body));
  saveAuth(response.data);
  return response;
}

export async function register(
  body: RegisterRequest,
): Promise<ApiResponse<AuthUser>> {
  const response = await wrapResponse(apiClient.post<AuthUser>("/v1/auth/register", body));
  saveAuth(response.data);
  return response;
}