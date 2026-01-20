'use client';

import { useState, useEffect } from 'react';

type Unsubscribe = () => void;
type SubscribeFunction<T> = (
  callback: (data: T) => void,
) => Unsubscribe | Promise<Unsubscribe>;

/**
 * Hook for subscribing to PocketBase or Firebase realtime data
 * @param subscribeFunction Function that sets up the listener and returns unsubscribe function
 * @param initialData Optional initial data to use before the listener is set up
 * @param dependencies Array of dependencies that should trigger listener reset
 */
export function useRealtimeData<T>(
  subscribeFunction: SubscribeFunction<T>,
  initialData?: T,
  dependencies: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(
    initialData === undefined || initialData === null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only set loading to true if we don't have data yet
    if (data === null) {
      setLoading(true);
    }
    setError((prev) => (prev === null ? prev : null));

    let isMounted = true;
    let unsubscribe: Unsubscribe | null = null;

    const setupListener = async () => {
      try {
        const result = await subscribeFunction((newData) => {
          if (isMounted) {
            setData(newData);
            setLoading(false);
          }
        });
        if (isMounted) {
          unsubscribe = result;
        } else if (result && typeof result === 'function') {
          result();
        }
      } catch {
        if (isMounted) {
          setError('Realtime connection failed');
          setLoading(false);
        }
      }
    };

    setupListener();

    return () => {
      isMounted = false;
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeFunction, ...dependencies]);

  return { data, loading, error };
}
