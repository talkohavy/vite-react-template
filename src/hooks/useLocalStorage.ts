import { useCallback, useEffect, useState } from 'react';
import { parseJson } from '@src/common/utils/parseJson';

export function useLocalStorage<T = any>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | string | undefined>(() => {
    const item = localStorage.getItem(key);

    if (item) {
      const parsedItem = parseJson<T>(item);
      const returnedValue = parsedItem ?? item;
      return returnedValue;
    }

    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const deleteValue = useCallback(() => localStorage.removeItem(key), [key]);

  return [value, setValue, deleteValue] as [T, React.Dispatch<React.SetStateAction<T>>, () => void];
}
