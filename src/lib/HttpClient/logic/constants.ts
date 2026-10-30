import { API_URLS } from '@src/common/constants/apiUrls';

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HttpMethodValues = (typeof HttpMethod)[keyof typeof HttpMethod];

export const HttpHeaders = {
  REQUEST_ID: 'x-request-id',
  BROWSER_ID: 'x-browser-id',
  TAB_ID: 'x-tab-id',
} as const;

export type HttpHeadersValues = (typeof HttpHeaders)[keyof typeof HttpHeaders];

/**
 * A 401 from these doesn't mean the access token expired (e.g. a wrong password on login),
 * so it never triggers a refresh.
 */
export const URLS_WITHOUT_SESSION_REFRESH: Array<string> = [
  API_URLS.authLogin,
  API_URLS.authRefresh,
  API_URLS.authLogout,
];
