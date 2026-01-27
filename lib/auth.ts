import type { AuthRecord } from 'pocketbase';

import pb from './pocketbase';

/**
 * Interface representing a generic User for the application.
 */
export interface AppUser extends AuthRecord {
  role?: string;
}

/**
 * Gets the current authenticated user and their admin status.
 */
export function getCurrentAuth() {
  const record = pb.authStore.record as AppUser;
  const isAdmin =
    pb.authStore.isValid &&
    (pb.authStore.isSuperuser ||
      !!record?.role ||
      record?.email?.includes('zulfikawr'));

  return { user: record, isAdmin };
}

/**
 * Subscribes to authentication state changes.
 * @param callback Function to call when auth state changes.
 * @returns Unsubscribe function.
 */
export function onAuthChange(
  callback: (user: AppUser | null, isAdmin: boolean) => void,
) {
  return pb.authStore.onChange(() => {
    const { user, isAdmin } = getCurrentAuth();
    callback(user, isAdmin);
  });
}

/**
 * Exports the current auth store state to a cookie string.
 */
export function getAuthCookie() {
  return pb.authStore.exportToCookie({
    httpOnly: false,
    path: '/',
  });
}
