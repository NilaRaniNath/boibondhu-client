"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, setAccessToken } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncAuth = useCallback((accessToken: string, userData: User) => {
    setToken(accessToken);
    setAccessToken(accessToken);
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    async function refresh() {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json() as { accessToken: string; user: User };
          syncAuth(data.accessToken, data.user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    }
    refresh();
  }, [syncAuth, clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api<{ accessToken: string; user: User }>(
        "/api/auth/login",
        { method: "POST", json: { email, password } }
      );
      syncAuth(data.accessToken, data.user);
    },
    [syncAuth]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await api<{ accessToken: string; user: User }>(
        "/api/auth/register",
        { method: "POST", json: { name, email, password } }
      );
      syncAuth(data.accessToken, data.user);
    },
    [syncAuth]
  );

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
