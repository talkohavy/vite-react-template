import type { HttpMethodValues } from './logic/constants';

export type HttpClientProps = {
  baseUrl?: string;
  /**
   * Called when the session can't be refreshed anymore (the server answered the refresh with 401),
   * i.e. the user must log in again.
   */
  onSessionExpired?: () => void;
};

export type FetchOptions = {
  body?: any;
  headers?: HeadersInit;
};

export type ExecuteProps = {
  url: string;
  method: HttpMethodValues;
} & FetchOptions;

export type SendRequestProps = {
  /**
   * Without the base url.
   */
  url: string;
  /**
   * With the base url.
   */
  fullTargetUrl: string;
  headers: Headers;
  method: HttpMethodValues;
  body: any;
  requestId: string;
};

export type SendRequestWithSignalProps = SendRequestProps & {
  signal: AbortSignal;
};

export type RequestInfo = {
  url: string;
  method: HttpMethodValues;
  body?: any;
  headers: HeadersInit;
  requestId: string;
};

export type HttpRequest<T = any> = {
  promise: Promise<T>;
  requestInfo: RequestInfo;
  abort: () => void;
};

export type HttpErrorConstructorProps = {
  message: string;
  status: number;
  url: string;
  method: HttpMethodValues;
  requestBody: any;
  requestHeaders: any;
  responseHeaders: any;
  requestId: string;
  type: string;
};

export type ResponseError = {
  message: string;
  status: number;
  originalError?: any;
};
