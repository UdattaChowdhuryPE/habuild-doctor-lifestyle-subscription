// Simple frontend-only auth using localStorage

export interface AuthUser {
  phone: string;
  fullName: string;
  referralLink?: string;
}

const AUTH_KEY = 'auth_user';

export function getAuthUser(): AuthUser | null {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}
