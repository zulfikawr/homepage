'use client';

import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';
import { useLoadingToggle } from '@/contexts/loadingContext';

/**
 * A generic hook to fetch and subscribe to any PocketBase collection.
 *
 * @param collectionName - The name of the PB collection.
 * @param mapper - A function to map the raw RecordModel to your clean TypeScript type.
 * @param options - PB fetch options (sort, filter, etc.)
 * @param initialData - Optional initial data to prevent loading states
 */
export function useCollection<T>(
  collectionName: string,
  mapper: (record: RecordModel) => T,
  options: Record<string, unknown> = {},
  initialData?: T[],
) {
  const [data, setData] = useState<T[]>(initialData || []);
  const [dataLoading, setDataLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);
  const { forceEmpty, forceLoading } = useLoadingToggle();

  // Memoize options to prevent unnecessary refetches
  const optionsKey = JSON.stringify(options);

  const fetchData = useCallback(async () => {
    try {
      const records = await pb
        .collection(collectionName)
        .getFullList<RecordModel>({
          ...JSON.parse(optionsKey),
          requestKey: null, // Global disable for this request
        });
      setData(records.map(mapper));
      setError(null);
      setDataLoading(false);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'isAbort' in err && err.isAbort)
        return; // Don't update state if request was cancelled

      console.error(`Error fetching collection ${collectionName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setDataLoading(false);
    }
  }, [collectionName, mapper, optionsKey]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: () => void;

    queueMicrotask(() => {
      if (isMounted) fetchData();
    });

    // Subscribe to realtime updates
    pb.collection(collectionName)
      .subscribe('*', () => {
        if (isMounted) fetchData();
      })
      .then((unsub) => {
        if (isMounted) {
          unsubscribe = unsub;
        } else {
          unsub();
        }
      })
      .catch((err) => {
        if (!err.isAbort) {
          console.error(`Subscribe error for ${collectionName}:`, err);
        }
      });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName, fetchData]);

  return {
    data: forceEmpty ? [] : data,
    loading: dataLoading || forceLoading,
    error,
    refetch: fetchData,
  };
}
