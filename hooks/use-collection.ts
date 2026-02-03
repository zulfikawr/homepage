'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLoadingToggle } from '@/contexts/loading-context';

/**
 * A generic hook to fetch any collection from local D1 API.
 */
export function useCollection<T>(
  collectionName: string,
  mapper: (record: Record<string, unknown>) => T,
) {
  const [data, setData] = useState<T[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { forceEmpty, forceLoading } = useLoadingToggle();
  const isFirstMount = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/collection/${collectionName}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const result = (await res.json()) as {
        results: Record<string, unknown>[];
      };
      setData(result.results.map(mapper));
      setError(null);
      setDataLoading(false);
    } catch (err: unknown) {
      console.error(`Error fetching collection ${collectionName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setDataLoading(false);
    }
  }, [collectionName, mapper]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchData();
    }
  }, [fetchData]);

  return {
    data: forceEmpty ? [] : data,
    loading: dataLoading || forceLoading,
    error,
    refetch: fetchData,
  };
}
