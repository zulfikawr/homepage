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

  const authData = localStorage.getItem('authUser');
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
  localStorage.setItem('authUser', JSON.stringify(user));
  const isAdmin = user.role === 'admin' || user.email.includes('zulfikawr');
  // Set a simple cookie for middleware/server-side checks
  document.cookie = `isAdmin=${isAdmin ? 'true' : 'false'}; path=/; max-age=86400; SameSite=Lax; Secure`;
  window.dispatchEvent(new Event('storage'));
}

export function logout() {
  localStorage.removeItem('authUser');
  document.cookie =
    'isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
  window.dispatchEvent(new Event('storage'));
}
