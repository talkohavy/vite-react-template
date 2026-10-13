import { useState } from 'react';
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

  const setAndPersistValue = (newValue: React.SetStateAction<T>) => {
    // @ts-ignore
    const resolvedValue = typeof newValue === 'function' ? newValue(value) : newValue;

    localStorage.setItem(key, JSON.stringify(resolvedValue));
    setValue(resolvedValue);
  };

  const deleteValue = () => {
    localStorage.removeItem(key);
  };

  return [value, setAndPersistValue, deleteValue] as [T, React.Dispatch<React.SetStateAction<T>>, () => void];
}
