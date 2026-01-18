'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';
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

const emptySubscribe = () => () => {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    (callback) => pb.authStore.onChange(() => callback()),
    () => pb.authStore.record,
    () => null,
  );

  const isAdmin = useSyncExternalStore(
    (callback) => pb.authStore.onChange(() => callback()),
    () => {
      const record = pb.authStore.record;
      return (
        !!record &&
        pb.authStore.isValid &&
        (pb.authStore.isSuperuser ||
          (record as unknown as { role?: string }).role === 'admin')
      );
    },
    () => false,
  );

  const loading = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  );

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
