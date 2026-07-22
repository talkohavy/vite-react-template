import { syncRequestsTableName } from '@src/common/constants';
import { httpClient } from '@src/lib/HttpClient';
import { indexedDBClient } from '@src/lib/IndexedDB';
import { fireSyncEvent } from '../../../logic/utils/fireSyncEvent';
import type { RequestDetails } from '@src/common/types';

export async function sendDataLater(requestDetails: RequestDetails) {
  await indexedDBClient.addRecord({ tableName: syncRequestsTableName, data: requestDetails });
  await fireSyncEvent();
}

export async function sendDataNow(requestDetails: RequestDetails) {
  const { url, options } = requestDetails;

  await httpClient.post(url, options).promise;
}
