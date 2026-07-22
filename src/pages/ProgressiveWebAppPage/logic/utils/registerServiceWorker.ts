import { isServiceWorkerFeatureEnabled } from '@src/common/utils/isServiceWorkerFeatureEnabled';

export async function registerServiceWorker() {
  if (!isServiceWorkerFeatureEnabled()) {
    return console.warn('Service Worker is not supported in this browser.');
  }

  try {
    const response = await navigator.serviceWorker.register('/sw.js'); // <--- `register` can also accept a second parameter for options: ", { scope: '/help/' }", but the location of the sw.js in the dist folder is the most important. Meaning, if the sw.js is in a subfolder /help/, setting scope here to "/" won't work.
    console.log('Service Worker registered with scope:', response.scope);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}
