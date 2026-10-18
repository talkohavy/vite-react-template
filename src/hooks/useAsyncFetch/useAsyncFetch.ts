import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearInFlightPromise,
  getCachedEntry,
  getCacheKey,
  getInFlightPromise,
  isFresh,
  setCachedData,
  setInFlightPromise,
  scheduleGc,
} from './fetchCache';
import type { HttpRequest } from '@src/lib/HttpClient';

type UseAsyncFetchProps<ReturnType, TransformType = ReturnType> = {
  /**
   * @description
   * Doesn't need to be a memoed function!
   *
   * A new request will NOT be invoked upon a new reference.
   * But please keep it in sync with `dependencies` prop to make sure that
   * the request is properly invoked and only when needed.
   *
   * @example
   * const { data, isError, isLoading } = useAsyncFetch({
   *   asyncFunc: () => {
   *     return httpClient.get<GalleryResponseDto>(
   *       `/users-service/users?page=${page}&view=${viewType}&limit=${ITEMS_PER_PAGE}`,
   *     );
   *   },
   *   dependencies: [page, viewType],
   * });
   */
  asyncFunc: (props: any) => HttpRequest<ReturnType>;
  /**
   * **IMPORTANT NOTE! Passing undefined will qualify as `true`!!! Be sure to do `Boolean(flag)` to avoid weird situations.**
   *
   *
   * `isAutoFetch` is set to `true` by default.
   *
   * When `true`, fetch will be invoked automatically.
   *
   * There are two ways to use this property:
   *
   * 1. If you want full manual control, you can set this to `false`,
   * and use the `fetchData` function returned from the hook.
   * Note that `isLoading` & `isError` would still be updated correctly.
   *
   * 2. If you want fetching enabled intermittently, you can toggle `isAutoFetch`.
   *
   * Whether this property is set to `true` or `false`, you can still use the `fetchData` function.
   *
   * @default true
   */
  isAutoFetch?: boolean;
  /**
   * Should be a memoed function.
   */
  transform?: (data: ReturnType) => TransformType;
  /**
   * Should be a memoed function.
   */
  onSuccess?: (data: TransformType) => void;
  /**
   * Should be a memoed function.
   */
  onError?: (error: any) => void;
  /**
   * What changes should execute another fetch?
   *
   * Defaults to "on component mount", which means it only happens once.
   *
   * @default []
   */
  dependencies?: any[];
  /**
   * Should throw an error if the request fails.
   *
   * @default true
   */
  shouldThrow?: boolean;
  /**
   * Unique key for caching (useQuery-style). Same key = same cache entry.
   * When provided, responses are cached and reused across components/mounts.
   *
   * @example
   * queryKey: ['users', page, viewType]
   */
  queryKey?: unknown[];
  /**
   * How long (ms) until cached data is considered stale. Stale data triggers a background refetch.
   * - 0: Always refetch (cache used for deduplication only)
   * - Infinity: Never consider stale (no background refetch)
   * - e.g. 5 * 60 * 1000: 5 minutes
   *
   * @default 0
   */
  staleTime?: number;
  /**
   * For how long (ms) to keep data in cache before clearing it up.
   *
   * @default 5 * 60 * 1000 (5 minutes)
   */
  cacheDuration?: number;
};

/**
 * **IMPORTANT NOTE!**
 *
 * When providing type T, it's up to you to add 'undefined' to the type,
 * depending on the value of `shouldThrow`.
 *
 * If `shouldThrow` is set to `false`, the hook WILL ALWAYS return `undefined` when the request fails!
 *
 * If you set `shouldThrow` to `true`, the hook will throw an error if the request fails.
 *
 * `shouldThrow` defaults to `false`.
 */
export type AsyncFetchResult<T> = {
  /**
   * Pass `{ forceRefetch: true }` to bypass cache and always hit the network
   */
  fetchData: (funcProps?: any, options?: { forceRefetch?: boolean }) => Promise<T>;
} & (
  | { isLoading: true; isError: false; data: undefined }
  | { isLoading: false; isError: true; data: undefined }
  | { isLoading: false; isError: false; data: T }
);

const DEFAULT_GC_TIME = 5 * 60 * 1000; // 5 minutes

export function useAsyncFetch<ReturnType, TransformType = ReturnType>(
  props: UseAsyncFetchProps<ReturnType, TransformType>,
): AsyncFetchResult<TransformType> {
  const {
    asyncFunc,
    transform,
    isAutoFetch = true,
    onSuccess,
    onError,
    dependencies = [],
    shouldThrow = true,
    queryKey,
    staleTime = 0,
    cacheDuration = DEFAULT_GC_TIME,
  } = props;

  const cacheKey = queryKey ? getCacheKey(queryKey) : null;
  const initialCached = cacheKey ? getCachedEntry<TransformType>(cacheKey) : undefined;

  const [isLoading, setIsLoading] = useState(() => {
    // If we have cached data (fresh or stale), show it immediately without loading
    if (initialCached) return false;

    return isAutoFetch;
  });
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<TransformType | undefined>(initialCached?.data);

  const asyncFuncRef = useRef(asyncFunc);
  const abortRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    asyncFuncRef.current = asyncFunc;
  }, [asyncFunc]);

  const fetchData = useCallback(
    async (funcProps?: any, options?: { forceRefetch?: boolean }) => {
      const forceRefetch = Boolean(options?.forceRefetch);

      // --- Cache: stale-while-revalidate (skip when forceRefetch) ---
      if (cacheKey && !forceRefetch) {
        const cached = getCachedEntry<TransformType>(cacheKey);

        if (cached) {
          setData(cached.data);
          setIsError(false);
          onSuccess?.(cached.data);

          if (isFresh(cached, staleTime)) {
            setIsLoading(false);
            return cached.data;
          }
          // else, data is stale, we need to schedule a background refetch
        }

        // Deduplication: reuse in-flight request for same key
        const inFlight = getInFlightPromise(cacheKey);

        if (inFlight) {
          return (inFlight as Promise<TransformType>)
            .then((result) => {
              setData(result);
              setIsLoading(false);
              onSuccess?.(result);

              return result;
            })
            .catch((e) => {
              setIsError(true);
              onError?.(e);
              setIsLoading(false);

              if (shouldThrow) throw e;
            });
        }
      }

      setIsLoading(true);
      setIsError(false);

      const doFetch = async () => {
        const { promise, abort } = asyncFuncRef.current(funcProps);
        abortRef.current = abort;

        const data = await promise;
        const updatedData = (transform ? transform(data) : data) as TransformType;

        if (cacheKey) {
          setCachedData(cacheKey, updatedData);
          scheduleGc(cacheKey, cacheDuration);
        }

        setData(updatedData);
        setIsError(false);
        onSuccess?.(updatedData);

        return updatedData;
      };

      const promise = doFetch();

      if (cacheKey) {
        setInFlightPromise(cacheKey, promise);
        promise.finally(() => {
          clearInFlightPromise(cacheKey);
        });
      }

      return promise.then(
        (result) => {
          setIsLoading(false);

          return result;
        },
        (error) => {
          console.error(error);
          setIsError(true);
          onError?.(error);
          setIsLoading(false);

          if (shouldThrow) throw error;
        },
      );
    },
    [transform, onSuccess, onError, shouldThrow, cacheKey, staleTime, cacheDuration],
  );

  useEffect(() => {
    if (!isAutoFetch) return;

    // Added catch to prevent page crash on error
    // The effect syncs with the network; fetchData has to flip isLoading/data before the request starts.
    // oxlint-disable-next-line react-hooks/set-state-in-effect
    fetchData().catch((error) => {
      if (error.name == 'AbortError') return;

      console.error('Error fetchData:', error);
    });
    // eslint-disable-next-line
  }, [fetchData, isAutoFetch, ...dependencies]);

  return { isLoading, isError, data, fetchData } as AsyncFetchResult<TransformType>;
}
