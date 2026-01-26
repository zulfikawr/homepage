'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import {
  type AppUser,
  getAuthCookie,
  getCurrentAuth,
  onAuthChange,
} from '@/lib/auth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial sync after mount to avoid hydration mismatch
    const syncAuth = () => {
      const { user: currentUser, isAdmin: currentIsAdmin } = getCurrentAuth();
      setUser(currentUser);
      setIsAdmin(currentIsAdmin);
      // Sync to cookie for middleware
      document.cookie = getAuthCookie();
      setLoading(false);
    };

    syncAuth();

    // Listen to auth changes
    const unsubscribe = onAuthChange((newUser, newIsAdmin) => {
      setUser(newUser);
      setIsAdmin(newIsAdmin);
      // Sync to cookie for middleware
      document.cookie = getAuthCookie();
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
