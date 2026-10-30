import { API_GATEWAY_URL } from '@src/common/constants/apiUrls';
import { dbName, tables } from '@src/common/constants/indexedDB';
import { initHttpClient } from '@src/lib/HttpClient';
import { initIndexedDB } from '@src/lib/IndexedDB';
import { AssetManager, type AssetManagerOptions } from './logic/AssetManager';
import { syncAllRequests } from './logic/utils/syncAllRequests';
import { MyServiceWorker } from './ServiceWorker';

initServiceWorker();

function initServiceWorker() {
  const version = 1;

  const assetManagerOptions: AssetManagerOptions = {
    cacheIgnoreList: ['@fs', '@react-refresh', '@vite', 'chrome-extension://'],
    cacheLimit: 2000,
  };

  const assetManager = new AssetManager(assetManagerOptions);
  initHttpClient({ baseUrl: API_GATEWAY_URL });
  const indexedDBInitPromise = initIndexedDB({ dbName, tables, version });

  MyServiceWorker.getInstance(self);
  MyServiceWorker.addOnInstalListener(assetManager.cacheStaticAssets.bind(assetManager));
  MyServiceWorker.addOnActivateListener(assetManager.cleanUpOldCaches.bind(assetManager));
  MyServiceWorker.addOnFetchListener(assetManager.cacheWithNetworkFallbackStrategy.bind(assetManager));
  MyServiceWorker.addOnSyncListener((event) => {
    event.waitUntil(indexedDBInitPromise.then(syncAllRequests));
  });
}
