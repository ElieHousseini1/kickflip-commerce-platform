"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import { loginUser, logoutUser, registerUser } from "@/services/auth-service";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);

  const login = useCallback(async (credentials) => {
    const result = await loginUser(credentials);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const register = useCallback(async (fields) => {
    const result = await registerUser(fields);
    setUser(result.user);
    return result;
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [login, logout, register, user],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
