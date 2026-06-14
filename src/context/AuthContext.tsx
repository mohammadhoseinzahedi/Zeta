"use client";
import { AuthenticatedUser } from "@/lib/auth";
import { createContext, useContext, useEffect, useState } from "react";

type User = AuthenticatedUser | null;

// Update context to include fetchUser
const AuthContext = createContext<{
  user: User;
  loading: boolean;
  fetchUser: () => Promise<void>;
}>({
  user: null,
  loading: true,
  fetchUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
