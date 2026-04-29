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
  const [email, setEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("fureverbook_email");
    setEmail(stored);
  }, []);

  const userQuery = useQuery(
    api.auth.getCurrentUser,
    email ? { email } : { email: "" }
  );

  const loginMutation = useMutation(api.auth.login);
  const signupMutation = useMutation(api.auth.signup);

  const login = async (loginEmail: string, password: string) => {
    await loginMutation({ email: loginEmail, password });
    localStorage.setItem("fureverbook_email", loginEmail);
    setEmail(loginEmail);
  };

  const signup = async (data: { email: string; password: string; name: string; dogName?: string; dogBreed?: string }) => {
    await signupMutation(data);
    localStorage.setItem("fureverbook_email", data.email);
    setEmail(data.email);
  };

  const logout = () => {
    localStorage.removeItem("fureverbook_email");
    setEmail(null);
  };

  const user = mounted && email && userQuery ? { _id: userQuery._id, email: userQuery.email, name: userQuery.name, dogName: userQuery.dogName, dogBreed: userQuery.dogBreed } : null;

  return (
    <AuthContext.Provider value={{ user, loading: !mounted || (!!email && !userQuery), login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
