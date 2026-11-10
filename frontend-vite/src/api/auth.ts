// src/api/auth.ts
const BASE_URL = "http://localhost:4000/api";

export type AuthUser = {
  id: string;
  email: string;
  handle?: string;
  createdAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

// Optional small helpers to keep token usage consistent across app
const TOKEN_KEY = "aaroha_token";
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function throwIfNotOk(res: Response, fallback: string) {
  if (!res.ok) {
    return res.text().then((t) => {
      const msg = t && t.startsWith("{") ? (() => {
        try { return JSON.parse(t).error || fallback; } catch { return fallback; }
      })() : (t || fallback);
      throw new Error(msg);
    });
  }
  return res;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => throwIfNotOk(r, "Login failed"));

  return res.json();
}

export async function signupRequest(name: string, email: string, password: string): Promise<AuthResponse> {
  // Backend expects { email, password }. It ignores name; you can store it later via /user/me if needed.
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => throwIfNotOk(r, "Signup failed"));

  return res.json();
}
