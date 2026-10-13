import { dynamicTableName } from '@src/common/constants';
import { useCachedContent } from '@src/hooks/useCachedContent';
import { indexedDBClient } from '@src/lib/IndexedDB';
import { cacheContentOnDemand } from '../../../logic/utils/cacheContentOnDemand';
import { fetchUserById } from '../../../logic/utils/fetchUserById';
import type { User } from '../../../types';

const id = 1;
const shouldFetchFromNetworkAfterCache = true;

async function thenNetworkCallback(setData: (data: User) => void) {
  const user = await fetchUserById(id);

  if (!user) {
    /**
     * Action Required!
     *
     * Expand the check to confirm you actually got back a 404
     * Also need to think what to do when with the currently deleted User.
     * Should we use setData to do something? or not?
     */
    await indexedDBClient.deleteRecordById({ tableName: dynamicTableName, id });
    return;
  }

  await cacheContentOnDemand(user);

  setData(user);
}

export function useCacheContentTabLogic() {
  const { data, setData } = useCachedContent<User>({
    id,
    callback: shouldFetchFromNetworkAfterCache ? thenNetworkCallback : undefined,
  });

  const fetchAndSaveContentOnDemand = async () => {
    const user = await fetchUserById(id);

    if (!user) return;

    await cacheContentOnDemand(user);

    setData(user);
  };

  return { data, fetchAndSaveContentOnDemand, shouldFetchFromNetworkAfterCache };
}
