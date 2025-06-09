'use client';

import { useState, useEffect } from 'react';

type SubscribeFunction<T> = (callback: (data: T) => void) => () => void;

/**
 * Hook for subscribing to Firebase realtime data
 * @param subscribeFunction Function that sets up the Firebase listener and returns unsubscribe function
 * @param initialData Optional initial data to use before the listener is set up
 * @param dependencies Array of dependencies that should trigger listener reset
 */
export function useRealtimeData<T>(
  subscribeFunction: SubscribeFunction<T>,
  initialData?: T,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = subscribeFunction((newData) => {
        if (isMounted) {
          setData(newData);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Error setting up realtime listener:', err);
      if (isMounted) {
        setError('Failed to connect to database');
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, dependencies);

  return { data, loading, error };
}
