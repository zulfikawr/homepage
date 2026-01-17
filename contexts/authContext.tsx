'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import type { AuthModel } from 'pocketbase';

interface AuthContextType {
  user: AuthModel | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthModel | null>(pb.authStore.model);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initial check
    setUser(pb.authStore.model);
    setIsAdmin(
      !!pb.authStore.model &&
        pb.authStore.isValid &&
        (pb.authStore.isAdmin ||
          (pb.authStore.model as unknown as { role?: string }).role ===
            'admin'),
    );
    setLoading(false);

    // Listen to auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
      setIsAdmin(
        !!model &&
          pb.authStore.isValid &&
          (pb.authStore.isAdmin ||
            (model as unknown as { role?: string }).role === 'admin'),
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
