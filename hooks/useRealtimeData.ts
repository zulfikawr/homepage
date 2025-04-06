'use client';

import { useEffect, useState } from 'react';

type SubscribeFunction<T> = (callback: (data: T) => void) => () => void;

export const useRealtimeData = <T>(subscribeFunction: SubscribeFunction<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeFunction((newData) => {
      try {
        setData(newData);
        setError(null);
      } catch (err) {
        setError('Failed to process data');
        console.error('Error processing realtime data:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeFunction]);

  return { data, loading, error };
};
