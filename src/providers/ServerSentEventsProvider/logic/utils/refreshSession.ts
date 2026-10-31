import { httpClient } from '@src/lib/HttpClient';

export async function refreshSession(): Promise<boolean> {
  const isRefreshed = await httpClient.refreshSession();

  return isRefreshed;
}
