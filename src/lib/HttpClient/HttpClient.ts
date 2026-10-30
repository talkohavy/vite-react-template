import { API_URLS } from '@src/common/constants/apiUrls';
import { StatusCodes } from '@src/common/constants/statusCodes';
import { uuid } from '@src/common/utils/uuid';
import { sessionManager } from '../SessionManager';
import { HttpHeaders, HttpMethod, URLS_WITHOUT_SESSION_REFRESH } from './logic/constants';
import { HttpError } from './logic/HttpError';
import type {
  ExecuteProps,
  FetchOptions,
  HttpClientProps,
  HttpRequest,
  RequestInfo,
  ResponseError,
  SendRequestProps,
  SendRequestWithSignalProps,
} from './types';

export let httpClient: HttpClient;

export class HttpClient {
  abortControllers: Map<string, AbortController>;
  private _baseUrl?: string;
  private readonly onSessionExpired?: () => void;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(props: HttpClientProps) {
    const { baseUrl, onSessionExpired } = props;

    this._baseUrl = baseUrl;
    this.onSessionExpired = onSessionExpired;
    this.abortControllers = new Map();
  }

  set baseUrl(url: string) {
    this._baseUrl = url;
  }

  /**
   * @description
   * `url` should be without the BASE_URL!
   *
   * i.e. if the full url is "http://localhost:8000/users",
   * then you should pass in only "/users".
   *
   * The "http://localhost:8000" part is considered as BASE_URL, and is added automatically.
   */
  get<ResponseDto = any>(url: string, options?: FetchOptions): HttpRequest<ResponseDto> {
    return this.execute<ResponseDto>({ url, method: HttpMethod.GET, ...options });
  }

  /**
   * @description
   * `url` should be without the BASE_URL!
   *
   * i.e. if the full url is "http://localhost:8000/users",
   * then you should pass in only "/users".
   *
   * The "http://localhost:8000" part is considered as BASE_URL, and is added automatically.
   */
  post<ResponseDto = any>(url: string, options?: FetchOptions): HttpRequest<ResponseDto> {
    return this.execute<ResponseDto>({ url, method: HttpMethod.POST, ...options });
  }

  put<ResponseDto = any>(url: string, options?: FetchOptions): HttpRequest<ResponseDto> {
    return this.execute<ResponseDto>({ url, method: HttpMethod.PUT, ...options });
  }

  patch<ResponseDto = any>(url: string, options?: FetchOptions): HttpRequest<ResponseDto> {
    return this.execute<ResponseDto>({ url, method: HttpMethod.PATCH, ...options });
  }

  delete<ResponseDto = any>(url: string, options?: FetchOptions): HttpRequest<ResponseDto> {
    return this.execute<ResponseDto>({ url, method: HttpMethod.DELETE, ...options });
  }

  protected execute<ResponseDto = any>(props: ExecuteProps): HttpRequest<ResponseDto> {
    const { url, method, body, headers: additionalHeaders } = props;

    const requestId = uuid();
    const fullTargetUrl = `${this._baseUrl}${url}`;
    const headers = new Headers(additionalHeaders);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set(HttpHeaders.REQUEST_ID, requestId);

    if (sessionManager) {
      const { localStorageId, sessionStorageId } = sessionManager.getSessionIds();
      headers.set(HttpHeaders.BROWSER_ID, localStorageId!);
      headers.set(HttpHeaders.TAB_ID, sessionStorageId!);
    }

    const promise = this.executeRequest<ResponseDto>({
      url,
      fullTargetUrl,
      headers,
      method,
      body,
      requestId,
    });

    const requestInfo: RequestInfo = {
      url: fullTargetUrl,
      method,
      body,
      headers,
      requestId,
    };

    const abort = () => {
      this.abortRequestById(requestId);
    };

    return { promise, requestInfo, abort };
  }

  /**
   * Invocations made while a refresh is still in flight share it,
   * since sending the same refresh token twice would look like token theft and end the session.
   *
   * @returns `true` if was able to refresh the session, `false` otherwise.
   */
  async refreshSession(): Promise<boolean> {
    this.refreshPromise ??= this.runSingleRefresh();

    const isRefreshed = await this.refreshPromise;

    return isRefreshed;
  }

  private async executeRequest<ResponseDto = any>(props: SendRequestProps): Promise<ResponseDto> {
    const { requestId } = props;

    const signal = this.addAbortControllerToList(requestId);

    try {
      const data = await this.sendWithSessionRefresh<ResponseDto>({ ...props, signal });

      return data;
    } finally {
      this.removeAbortControllerFromList(requestId);
    }
  }

  /**
   * An expired access token answers with 401: refresh the session, then retry the request once.
   */
  private async sendWithSessionRefresh<ResponseDto = any>(props: SendRequestWithSignalProps): Promise<ResponseDto> {
    const { url } = props;

    try {
      const data = await this.sendRequest<ResponseDto>(props);

      return data;
    } catch (error) {
      const shouldRefreshExpiredAccessToken =
        error.status === StatusCodes.Unauthorized && !URLS_WITHOUT_SESSION_REFRESH.includes(url);

      if (!shouldRefreshExpiredAccessToken) throw error;

      const isRefreshed = await this.refreshSession();

      if (!isRefreshed) throw error;

      const data = await this.sendRequest<ResponseDto>(props);

      return data;
    }
  }

  private async sendRequest<ResponseDto = any>(props: SendRequestWithSignalProps): Promise<ResponseDto> {
    const { fullTargetUrl, headers, method, body, requestId, signal } = props;

    const response = await fetch(fullTargetUrl, {
      body: JSON.stringify(body),
      headers,
      method,
      credentials: 'include' as RequestCredentials,
      signal,
    });

    const { error, data } = await this.handleServerResponse(response);

    if (error) {
      const { status, url, headers: responseHeaders, type } = response;

      throw new HttpError({
        message: error.message,
        status,
        url,
        method,
        requestBody: body,
        requestHeaders: headers,
        responseHeaders,
        requestId,
        type,
      });
    }

    return data;
  }

  private async runSingleRefresh(): Promise<boolean> {
    try {
      const isRefreshed = await this.sendRefreshRequest();

      return isRefreshed;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async sendRefreshRequest(): Promise<boolean> {
    try {
      const refreshTokenUrl = `${this._baseUrl}${API_URLS.authRefresh}`;

      const response = await fetch(refreshTokenUrl, {
        method: HttpMethod.POST,
        headers: { [HttpHeaders.REQUEST_ID]: uuid() },
        credentials: 'include' as RequestCredentials,
      });

      if (response.status === StatusCodes.Unauthorized) this.onSessionExpired?.();

      return response.ok;
    } catch {
      // A network error isn't an expired session: keep the user logged in, the next request can try again.
      return false;
    }
  }

  abortRequestById(requestId: string) {
    const controller = this.abortControllers.get(requestId);

    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  abortAllRequests() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }

    this.abortControllers.clear();
  }

  private async handleServerResponse(responseRaw: any): Promise<{ data?: any; error?: ResponseError }> {
    try {
      const parsedBody = await this.parseResponseBody(responseRaw);

      if (!responseRaw.ok) return this.handleNotOk(responseRaw.status, parsedBody);

      return { data: parsedBody };
    } catch (error) {
      return {
        error: {
          message: 'Failed to process response',
          status: responseRaw.status,
          originalError: error,
        },
      };
    }
  }

  private async parseResponseBody(responseRaw: any): Promise<{ data?: any; error?: any }> {
    const responseText = await responseRaw.text();
    let parsedBody: any;

    try {
      // Only try to parse as JSON if there's content
      parsedBody = responseText ? JSON.parse(responseText) : null;
    } catch {
      // If we can't parse as JSON, use the raw text
      parsedBody = { message: responseText || 'No response body' };
    }

    return parsedBody;
  }

  private handleNotOk(statusCode: number, parsedBody: any): { error: ResponseError } {
    const errorMessage =
      parsedBody?.message || parsedBody?.error || (typeof parsedBody === 'string' ? parsedBody : 'Request failed');

    return { error: { message: errorMessage, status: statusCode } };
  }

  private addAbortControllerToList(requestId: string) {
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

    return abortController.signal;
  }

  private removeAbortControllerFromList(requestId: string) {
    this.abortControllers.delete(requestId);
  }
}

export function initHttpClient(props: HttpClientProps) {
  httpClient = new HttpClient(props);
}
