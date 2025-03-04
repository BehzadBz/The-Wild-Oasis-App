"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import type { User } from "next-auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signOutClient: () => void;
}

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthContextProps) => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setUser(session?.user || null);
      setLoading(false);
    }
  }, [session, status]);

  const signOutClient = async () => {
    setUser(null);
    await update({ user: null });
    await signOut({ redirect: false });
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signOutClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
