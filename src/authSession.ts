import { clearAuth, getStoredAuth, saveAuth, type AuthUser } from "./service/auth";

let authenticated = Boolean(getStoredAuth());

export function isSessionAuthenticated(): boolean {
  return authenticated || getStoredAuth() !== null;
}

export function setAuthenticatedSession(authUser?: AuthUser): void {
  authenticated = true;

  if (authUser) {
    saveAuth(authUser);
  }
}

export function clearAuthenticatedSession(): void {
  authenticated = false;
  clearAuth();
}

export function getSessionUser(): AuthUser | null {
  return getStoredAuth();
}