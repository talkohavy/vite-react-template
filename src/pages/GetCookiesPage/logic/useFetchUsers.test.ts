import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { API_URLS } from '@src/common/constants';
import { httpClient } from '@src/lib/HttpClient';
import { useFetchUsers } from './useFetchUsers';

vi.mock('@src/lib/HttpClient', () => ({ httpClient: { get: vi.fn() } }));

const mockGet = vi.mocked(httpClient.get);

function mockGetResult(props: { promise: Promise<unknown>; abort?: () => void }) {
  const { promise, abort = vi.fn() } = props;

  mockGet.mockReturnValue({ promise, abort, requestInfo: { url: API_URLS.users, requestId: '1' } } as any);
}

describe('useFetchUsers', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users from the users endpoint on mount', () => {
    mockGetResult({ promise: Promise.resolve([]) });

    renderHook(useFetchUsers);

    expect(mockGet).toHaveBeenCalledWith(API_URLS.users);
  });

  it('should expose the fetched users', async () => {
    const expectedResult = [{ id: 1, email: 'dummy@gmail.com', nickname: 'dummy', role: 'admin' }];
    mockGetResult({ promise: Promise.resolve(expectedResult) });

    const { result } = renderHook(useFetchUsers);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const actualResult = result.current.users;
    expect(actualResult).toEqual(expectedResult);
  });

  it('should expose the error when the request fails', async () => {
    const expectedResult = { message: 'Unauthorized', status: 401 };
    mockGetResult({ promise: Promise.reject(expectedResult) });

    const { result } = renderHook(useFetchUsers);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const actualResult = result.current.error;
    expect(actualResult).toEqual(expectedResult);
  });

  it('should abort the request on unmount', () => {
    const abort = vi.fn();
    mockGetResult({ promise: new Promise(() => {}), abort });

    const { unmount } = renderHook(useFetchUsers);
    unmount();

    expect(abort).toHaveBeenCalledTimes(1);
  });
});
