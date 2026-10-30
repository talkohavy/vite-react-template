import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vite-plus/test';
import { API_URLS } from '@src/common/constants/apiUrls';
import { HttpClient } from './HttpClient';

const BASE_URL = 'http://api.test';

/**
 * Each path answers with its queued responses, in order.
 */
type ServerResponses = Record<string, Array<() => Response | Promise<Response>>>;

describe('HttpClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let onSessionExpired: Mock<() => void>;
  let httpClient: HttpClient;

  function mockServer(serverResponses: ServerResponses) {
    fetchMock.mockImplementation(async (input: string) => {
      const { pathname } = new URL(input);
      const createResponse = serverResponses[pathname]?.shift();

      if (!createResponse) throw new Error(`Unexpected request to ${pathname}`);

      const response = await createResponse();

      return response;
    });
  }

  function respondWith(status: number, body?: any) {
    return function createResponse() {
      const response = new Response(body === undefined ? null : JSON.stringify(body), { status });

      return response;
    };
  }

  function getRequestedPaths(): Array<string> {
    const requestedPaths = fetchMock.mock.calls.map(([input]) => new URL(input).pathname);

    return requestedPaths;
  }

  function countRefreshRequests(): number {
    const refreshRequests = getRequestedPaths().filter((pathname) => pathname === API_URLS.authRefresh);

    return refreshRequests.length;
  }

  async function getRejection(promise: Promise<unknown>): Promise<any> {
    try {
      await promise;
    } catch (error) {
      return error;
    }

    throw new Error('Expected the promise to reject');
  }

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    onSessionExpired = vi.fn();
    httpClient = new HttpClient({ baseUrl: BASE_URL, onSessionExpired });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('when the access token expired', () => {
    it('should refresh the session, then retry the request', async () => {
      const expectedResult = [API_URLS.users, API_URLS.authRefresh, API_URLS.users];
      mockServer({
        [API_URLS.users]: [respondWith(401), respondWith(200, [])],
        [API_URLS.authRefresh]: [respondWith(204)],
      });

      await httpClient.get(API_URLS.users).promise;

      const actualResult = getRequestedPaths();
      expect(actualResult).toEqual(expectedResult);
    });

    it('should resolve with the response of the retry', async () => {
      const expectedResult = [{ id: 1 }];
      mockServer({
        [API_URLS.users]: [respondWith(401), respondWith(200, [{ id: 1 }])],
        [API_URLS.authRefresh]: [respondWith(204)],
      });

      const actualResult = await httpClient.get(API_URLS.users).promise;

      expect(actualResult).toEqual(expectedResult);
    });

    it('should retry only once', async () => {
      mockServer({
        [API_URLS.users]: [respondWith(401), respondWith(401)],
        [API_URLS.authRefresh]: [respondWith(204)],
      });

      const error = await getRejection(httpClient.get(API_URLS.users).promise);

      expect(error.status).toBe(401);
    });
  });

  describe('when several requests get a 401 at the same time', () => {
    it('should refresh the session only once', async () => {
      let respondToRefresh: (response: Response) => void = () => {};
      const pendingRefreshResponse = new Promise<Response>((resolve) => {
        respondToRefresh = resolve;
      });
      mockServer({
        [API_URLS.users]: [respondWith(401), respondWith(401), respondWith(200, []), respondWith(200, [])],
        [API_URLS.authRefresh]: [() => pendingRefreshResponse, respondWith(204)],
      });
      const refreshSessionSpy = vi.spyOn(httpClient, 'refreshSession');

      const firstRequest = httpClient.get(API_URLS.users).promise;
      const secondRequest = httpClient.get(API_URLS.users).promise;
      await vi.waitFor(() => expect(refreshSessionSpy).toHaveBeenCalledTimes(2));
      respondToRefresh(new Response(null, { status: 204 }));
      await Promise.all([firstRequest, secondRequest]);

      const actualResult = countRefreshRequests();
      expect(actualResult).toBe(1);
    });
  });

  describe('when the session cannot be refreshed', () => {
    beforeEach(() => {
      mockServer({
        [API_URLS.users]: [respondWith(401, { message: 'Invalid or expired access token' })],
        [API_URLS.authRefresh]: [respondWith(401)],
      });
    });

    it('should call onSessionExpired', async () => {
      await getRejection(httpClient.get(API_URLS.users).promise);

      expect(onSessionExpired).toHaveBeenCalledOnce();
    });

    it("should reject with the original request's error", async () => {
      const expectedResult = { name: 'HttpError', status: 401, message: 'Invalid or expired access token' };

      const error = await getRejection(httpClient.get(API_URLS.users).promise);

      const actualResult = { name: error.name, status: error.status, message: error.message };
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('when the refresh request fails on the network', () => {
    it('should not call onSessionExpired, since the session may still be alive', async () => {
      mockServer({
        [API_URLS.users]: [respondWith(401)],
        [API_URLS.authRefresh]: [() => Promise.reject(new TypeError('Failed to fetch'))],
      });

      await getRejection(httpClient.get(API_URLS.users).promise);

      expect(onSessionExpired).not.toHaveBeenCalled();
    });
  });

  describe.each([API_URLS.authLogin, API_URLS.authRefresh, API_URLS.authLogout])('when %s answers with 401', (url) => {
    it('should not refresh the session', async () => {
      mockServer({ [url]: [respondWith(401)] });

      const expectedResult = [url];

      await getRejection(httpClient.post(url).promise);

      const actualResult = getRequestedPaths();
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('when a request fails with a status other than 401', () => {
    it('should not refresh the session', async () => {
      mockServer({ [API_URLS.users]: [respondWith(500)] });

      await getRejection(httpClient.get(API_URLS.users).promise);

      const actualResult = countRefreshRequests();
      expect(actualResult).toBe(0);
    });
  });
});
