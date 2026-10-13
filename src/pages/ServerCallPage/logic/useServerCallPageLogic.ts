import { useRef, useState } from 'react';
import { API_URLS } from '@src/common/constants';
import { httpClient, HttpMethod } from '@src/lib/HttpClient';
import { DEFAULT_USER_FORM_DATA } from './constants';
import type { RequestInfo, UserFormData } from './types';

export function useServerCallPageLogic() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const abortRef = useRef<(() => void) | null>(null);

  const [userFormData, setUserFormData] = useState<UserFormData>(DEFAULT_USER_FORM_DATA);

  function updateFormField<K extends keyof UserFormData>(field: K, value: UserFormData[K]) {
    setUserFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchUsers() {
    try {
      setError(null);
      setIsLoading(true);

      const httpResult = httpClient.get(API_URLS.users);
      const { requestInfo: info } = httpResult;

      setRequestInfo({
        method: 'GET',
        url: info.url,
        requestId: info.requestId,
      });

      const responseData = await httpResult.promise;
      setData(responseData);
    } catch (err) {
      setError(err);
    }

    setIsLoading(false);
  }

  async function createUser() {
    try {
      const body = {
        email: userFormData.email,
        password: userFormData.password,
        dateOfBirth: userFormData.dateOfBirth,
        nickname: userFormData.nickname,
        role: userFormData.role,
      };

      setError(null);
      setIsLoading(true);

      const httpResult = httpClient.post(API_URLS.users, { body });
      const { abort, requestInfo: info } = httpResult;

      setRequestInfo({
        method: HttpMethod.POST,
        url: info.url,
        requestId: info.requestId,
      });

      abortRef.current = abort;

      const responseData = await httpResult.promise;
      setData(responseData);
    } catch (err) {
      setError(err);
    }

    setIsLoading(false);
    abortRef.current = null;
  }

  function handleAbort() {
    const abortFunction = abortRef.current;

    if (abortFunction) {
      abortFunction();
      abortRef.current = null;
      setIsLoading(false);
      setError({ message: 'Request aborted by user' });
    }
  }

  return {
    isLoading,
    data,
    error,
    requestInfo,
    userFormData,
    updateFormField,
    fetchUsers,
    createUser,
    handleAbort,
  };
}
