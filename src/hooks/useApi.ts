'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api-client';

interface UseApiOptions {
  skip?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  url: string | null,
  options?: UseApiOptions
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip && !!url);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    // 이전 요청 취소
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await api.get<T>(url);
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options?.skip || !url) {
      setLoading(false);
      return;
    }

    fetchData();

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchData, options?.skip, url]);

  return { data, loading, error, refetch: fetchData };
}

// POST/PATCH/DELETE 용 mutation hook
interface UseMutationReturn<T, B> {
  mutate: (body?: B) => Promise<T | null>;
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMutation<T, B = unknown>(
  url: string,
  method: 'POST' | 'PATCH' | 'DELETE' = 'POST'
): UseMutationReturn<T, B> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (body?: B): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        let result: T;
        if (method === 'POST') {
          result = await api.post<T>(url, body);
        } else if (method === 'PATCH') {
          result = await api.patch<T>(url, body);
        } else {
          result = await api.delete<T>(url);
        }
        setData(result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : '요청에 실패했습니다.';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { mutate, data, loading, error };
}
