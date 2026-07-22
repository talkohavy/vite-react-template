import { useEffect, useRef, useState } from 'react';
import { dynamicTableName } from '@src/common/constants';
import { indexedDBClient } from '../lib/IndexedDB';

type useCachedContentProps<T> = {
  /**
   * The id of the cached content.
   * Must be a primitive value.
   */
  id: string | number;
  /**
   * A callback tht is invoked after the cached content is loaded,
   * whether it was found in the cache or not.
   *
   * Function doesn't have to be memoed.
   */
  callback?: (setData: (data: T | null) => void) => Promise<void>;
};

/**
 * @description
 * The fetch-from-cache only happens once onload (or when the `id` changes).
 * From that point, `data` is taken from the inner-state of the hook.
 *
 * You can set the state using `setData`,
 * but that won't update the cache with the new value.
 */
export function useCachedContent<T = any>(props: useCachedContentProps<T>) {
  const { id, callback } = props;

  const [data, setData] = useState<T | null>(null);
  const callbackRef = useRef({ callback });

  useEffect(() => {
    callbackRef.current = { callback };
  }, [callback]);

  useEffect(() => {
    async function loadCachedContentIfExists() {
      const cachedRecord = (await indexedDBClient.getRecordById({ tableName: dynamicTableName, id })) as T | null;

      if (cachedRecord) setData(cachedRecord);

      const cb = callbackRef.current.callback;

      if (cb) {
        try {
          await cb(setData);
        } catch {
          // silently fail
        }
      }
    }

    loadCachedContentIfExists();
  }, [id]);

  return { data, setData };
}
