export interface AppUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
  role?: string;
}

/**
 * Gets the current authenticated user from local state/cookies.
 * This is primarily for client-side UI toggles.
 */
export function getCurrentAuth() {
  if (typeof window === 'undefined') return { user: null, isAdmin: false };

  const authData = localStorage.getItem('auth_user');
  if (!authData) return { user: null, isAdmin: false };

  try {
    const user = JSON.parse(authData) as AppUser;
    const isAdmin = user.role === 'admin' || user.email.includes('zulfikawr');
    return { user, isAdmin };
  } catch {
    return { user: null, isAdmin: false };
  }
}

export function onAuthChange(
  callback: (user: AppUser | null, isAdmin: boolean) => void,
) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = () => {
    const { user, isAdmin } = getCurrentAuth();
    callback(user, isAdmin);
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}

export function getAuthCookie() {
  if (typeof window === 'undefined') return '';
  return document.cookie;
}

export function login(user: AppUser) {
  localStorage.setItem('auth_user', JSON.stringify(user));
  // Set a simple cookie for middleware/server-side checks
  document.cookie = `is_admin=${user.role === 'admin' ? 'true' : 'false'}; path=/; max-age=86400`;
  window.dispatchEvent(new Event('storage'));
}

export function logout() {
  localStorage.removeItem('auth_user');
  document.cookie = 'is_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  window.dispatchEvent(new Event('storage'));
}
