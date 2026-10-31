import { useEffect, useState } from 'react';
import { API_URLS } from '@src/common/constants';
import { httpClient } from '@src/lib/HttpClient';
import type { User } from './types';

export function useFetchUsers() {
  const [users, setUsers] = useState<Array<User>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isActive = true;
    let abort: (() => void) | null = null;

    async function fetchUsers() {
      try {
        setError(null);
        setIsLoading(true);

        const httpResult = httpClient.get(API_URLS.users);
        abort = httpResult.abort;

        const responseData = (await httpResult.promise) as Array<User>;

        if (isActive) setUsers(responseData);
      } catch (err) {
        if (isActive) setError(err);
      }

      if (isActive) setIsLoading(false);
    }

    fetchUsers();

    return () => {
      isActive = false;
      abort?.();
    };
  }, []);

  return { users, isLoading, error };
}
