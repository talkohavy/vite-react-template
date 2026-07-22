import { useCallback } from 'react';
import { dynamicTableName } from '@src/common/constants';
import Button from '@src/components/controls/Button';
import FallbackImage from '@src/components/FallbackImage';
import Image from '@src/components/Image';
import { useCachedAsset } from '@src/hooks/useCachedAsset/useCachedAsset';
import { useCachedContent } from '@src/hooks/useCachedContent';
import { indexedDBClient } from '@src/lib/IndexedDB';
import { cacheAssetOnDemand } from '../../logic/utils/cacheAssetOnDemand';
import { cacheContentOnDemand } from '../../logic/utils/cacheContentOnDemand';
import { fetchUserById } from '../../logic/utils/fetchUserById';
import type { User } from '../../types';

const id = 1;
const assetUrl = '/heart-256x256.png';
const isFreshData = true;

export default function FullExampleTab() {
  const { data: cachedAsset, setData: setCachedImageUrl } = useCachedAsset({
    assetUrl,
    isImage: true,
  });

  const thenNetworkCallback = useCallback(async (setData: (data: User) => void) => {
    const user = await fetchUserById(id);

    if (!user) {
      // Expand the check to confirm you actually got back a 404
      // Also need to think what to do when with the currently deleted User.
      // Should we use setData to do something?
      await indexedDBClient.deleteRecordById({ tableName: dynamicTableName, id });
      return;
    }

    await cacheContentOnDemand(user);
    setData(user);
  }, []);

  const { data: cachedContent, setData: setCachedContent } = useCachedContent<User>({
    id,
    callback: isFreshData ? thenNetworkCallback : undefined,
  });

  const fetchAndSaveAssetOnDemand = async () => {
    const response = await fetch(assetUrl);

    if (!response.ok) {
      console.error('Failed to fetch resource:', response.statusText);
      return;
    }

    await cacheAssetOnDemand(response);

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    setCachedImageUrl(objectUrl);
  };

  const fetchAndSaveContentOnDemand = async () => {
    const user = await fetchUserById(id);

    if (!user) return;

    await cacheContentOnDemand(user);

    setCachedContent(user);
  };

  return (
    <div className='size-full p-6 overflow-auto'>
      <div>Service Worker Tutorial</div>

      <Button className='mt-4' onClick={fetchAndSaveAssetOnDemand}>
        Fetch and cache asset on demand
      </Button>

      <Button className='mt-4' onClick={fetchAndSaveContentOnDemand}>
        Fetch and cache dynamic content
      </Button>

      <div>Chosen strategy: {isFreshData ? 'cache-then-network' : 'cache-only'}</div>

      <div className='mt-4'>
        <div>Cached Image:</div>

        {cachedAsset ? (
          <Image src={cachedAsset as string} alt='Cached Resource' className='w-1/2 h-auto'>
            <FallbackImage />
          </Image>
        ) : (
          <div>Empty</div>
        )}
      </div>

      <div className='mt-4'>
        <div>Cached Content:</div>
        {cachedContent ? <div>{JSON.stringify(cachedContent)}</div> : <div>Empty</div>}
      </div>

      <strong className='inline-block mt-10'>Description</strong>
      <div className='border rounded-md p-2 mt-4'>
        The above includes implementations of `only-cache` & `cache-then-network`. When `isFreshData` value is set to
        false, the chosen strategy is 'cache-only'. value of cache-then-network to true, not by checking the checkbox,
        but by hardcoding the value `true` in the code. Then, try refreshing the page. The value in front of you is
        stale. To confirm that, change the age of the user on the server to 100, and refresh the page again. You should
        see the old value, the stale value.
      </div>

      <strong className='inline-block mt-10'>only-cache</strong>
      <div className='border rounded-md p-2 mt-4'>
        When refreshing the page, the value you see in front of you is stale. To confirm that, change the age of the
        user on the server to 100, and refresh the page again. You should see the old value, the stale value.
      </div>

      <strong className='inline-block mt-10'>cache-then-network</strong>
      <div className='border rounded-md p-2 mt-4'>
        When refreshing the page, for a brief moment, the value you see in front of you is stale. A fetch request is
        being sent in the background to retrieve the up-to-date value, and when the fetch is successful, the pages
        renders and you see the current updated value. To confirm that, refresh the page once, then go to your server
        and change the age of the user on the server to 100, and refresh the page again. You should see the old value,
        followed by a render with the updated value.
      </div>
    </div>
  );
}
