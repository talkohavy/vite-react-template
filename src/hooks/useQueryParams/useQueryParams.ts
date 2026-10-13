import { useEffect, useState } from 'react';
import { QueryStringComposer } from './logic/QueryStringComposer';
import type { QueryParamValue } from './types';

export function useQueryParams() {
  const [queryParams, setQueryParams] = useState<Record<string, any>>(() => {
    return new QueryStringComposer(window.location.search).parseQueryParams();
  });

  const setParam = (key: string, value: QueryParamValue | QueryParamValue[] | undefined) => {
    const queryStringComposer = new QueryStringComposer(window.location.search);
    queryStringComposer.setParam(key, value);
    const newUrl = `${window.location.pathname}${queryStringComposer.toString() ? '?' : ''}${queryStringComposer.toString()}`; // <--- Update URL without reloading page!
    window.history.pushState({}, '', newUrl);
    const newQueryParams = queryStringComposer.parseQueryParams();
    setQueryParams(newQueryParams);
  };

  const setParams = (params: Record<string, QueryParamValue | QueryParamValue[] | undefined>) => {
    const queryStringComposer = new QueryStringComposer(window.location.search);
    queryStringComposer.setParams(params);
    const newUrl = `${window.location.pathname}${queryStringComposer.toString() ? '?' : ''}${queryStringComposer.toString()}`; // <--- Update URL without reloading page!
    window.history.pushState({}, '', newUrl);
    const newQueryParams = queryStringComposer.parseQueryParams();
    setQueryParams(newQueryParams);
  };

  const resetAllQueryParams = () => {
    window.history.pushState({}, '', window.location.pathname);
    setQueryParams({});
  };

  useEffect(() => {
    function handleUrlChange() {
      const newQueryParams = new QueryStringComposer(window.location.search).parseQueryParams();
      setQueryParams(newQueryParams);
    }

    window.addEventListener('popstate', handleUrlChange);

    /**
     * Create a custom event to detect URL changes not caught by popstate,
     * such as when using `window.history.pushState` or `window.history.replaceState`.
     * This approach is more reliable than watching for href attribute changes
     */
    const originalHistoryPushState = window.history.pushState;
    const originalHistoryReplaceState = window.history.replaceState;

    window.history.pushState = (...args) => {
      const result = originalHistoryPushState.apply(window.history, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    window.history.replaceState = (...args) => {
      const result = originalHistoryReplaceState.apply(window.history, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    window.addEventListener('locationchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('locationchange', handleUrlChange);

      window.history.pushState = originalHistoryPushState;
      window.history.replaceState = originalHistoryReplaceState;
    };
  }, []);

  return { queryParams, setParam, setParams, resetAllQueryParams };
}
