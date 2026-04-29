"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface User {
  _id: string;
  email: string;
  name: string;
  dogName?: string;
  dogBreed?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; name: string; dogName?: string; dogBreed?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("fureverbook_userId");
    if (stored) setUserId(stored);
  }, []);

  // Only call getCurrentUser when we have a userId — use "skip" to skip otherwise
  const userQuery = useQuery(
    api.auth.getCurrentUser,
    userId ? { userId } : "skip"
  ) as (User & { _id: string }) | null | undefined;

  const loginMutation = useMutation(api.auth.login);
  const signupMutation = useMutation(api.auth.signup);

  const login = async (loginEmail: string, password: string) => {
    const result = await loginMutation({ email: loginEmail, password });
    localStorage.setItem("fureverbook_userId", result.userId);
    setUserId(result.userId);
  };

  const signup = async (data: { email: string; password: string; name: string; dogName?: string; dogBreed?: string }) => {
    const result = await signupMutation(data);
    localStorage.setItem("fureverbook_userId", result.userId);
    setUserId(result.userId);
  };

  const logout = () => {
    localStorage.removeItem("fureverbook_userId");
    setUserId(null);
  };

  // Derive user: only when query has returned a valid user object
  const user = mounted && userId && userQuery && userQuery._id
    ? { _id: userQuery._id, email: userQuery.email, name: userQuery.name, dogName: userQuery.dogName, dogBreed: userQuery.dogBreed }
    : null;

  return (
    <AuthContext.Provider value={{ user, loading: !mounted || (!!userId && userQuery === undefined), login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
