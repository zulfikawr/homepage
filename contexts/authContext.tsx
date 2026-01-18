'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import pb from '@/lib/pocketbase';
import type { AuthRecord } from 'pocketbase';

interface AuthContextType {
  user: AuthRecord | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthRecord | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial sync after mount to avoid hydration mismatch
    const syncAuth = () => {
      const record = pb.authStore.record;
      setUser(record);
      setIsAdmin(
        !!record &&
          pb.authStore.isValid &&
          (pb.authStore.isSuperuser ||
            (record as unknown as { role?: string }).role === 'admin'),
      );
      setLoading(false);
    };

    syncAuth();

    // Listen to auth changes
    const unsubscribe = pb.authStore.onChange(() => {
      syncAuth();
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
