import CodeBlock from '@src/components/CodeBlock';
import LineOfCode from '@src/components/LineOfCode';
import Arrow from '@src/components/StoryTelling/Arrow';
import FlowStep from '@src/components/StoryTelling/FlowStep';
import MessageBox from '@src/components/StoryTelling/MessageBox';
import Scene from '@src/components/StoryTelling/Scene';

export default function RegisterServiceWorkerTab() {
  return (
    <div className='flex flex-col gap-5 size-full p-4 overflow-auto'>
      <div>
        <div className='text-3xl font-medium'>Register Service Worker</div>

        <p className='text-gray-500 dark:text-gray-400 mt-1 text-sm'>
          A story about how a service worker gets registered, initialised, and turns your web app into an
          offline-capable PWA.
        </p>
      </div>

      {/* ── 1. Registration in main.tsx ─────────────────────── */}
      <Scene badge='Step 1' title='Registration — it lives in main.tsx, outside of React'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          The very first thing you need to understand: <LineOfCode text='registerServiceWorker()' /> is called at the{' '}
          <strong>top level</strong> of <LineOfCode text='main.tsx' />, completely outside any JSX or React component
          tree.
        </p>

        <CodeBlock
          code={`const root = createRoot(rootElement);
root.render(<Client />);

registerServiceWorker();   // <-- right here, top-level, outside React`}
          language='typescript'
        />

        <MessageBox title='Why is this placement critical?'>
          If you register the service worker inside a React component (e.g. inside a <LineOfCode text='useEffect' />
          ), registration gets tied to that component&apos;s lifecycle. That means:
          <ul className='list-disc list-inside mt-1 space-y-1'>
            <li>
              It only runs when that component mounts — if the user never visits the page containing it, the SW never
              gets registered.
            </li>

            <li>It can re-run on every re-render or re-mount, causing unnecessary re-registration attempts.</li>

            <li>The service worker misses on some assets that are loaded prior to when the component mounted.</li>
          </ul>
          <p className='mt-2'>
            By calling it at the module level in <LineOfCode text='main.tsx' />, it runs exactly once, as early as
            possible, regardless of which page the user lands on. The SW starts installing immediately and can begin
            caching assets before the user even navigates.
          </p>
        </MessageBox>

        <div className='border rounded-lg p-3 text-sm'>
          <div className='font-semibold mb-1'>
            What <LineOfCode text='registerServiceWorker()' /> does:
          </div>

          <CodeBlock
            code={`export async function registerServiceWorker() {
  if (!isServiceWorkerFeatureEnabled()) {
    return console.warn('Service Worker is not supported in this browser.');
  }

  try {
    const response = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered with scope:', response.scope);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}`}
            language='typescript'
          />

          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            It checks browser support, then tells the browser to download and install <LineOfCode text='/sw.js' />. Once
            registered, the browser manages the SW lifecycle independently of your app.
          </p>
        </div>
      </Scene>

      {/* ── 2. initServiceWorker structure ──────────────────── */}
      <Scene badge='Step 2' title='initServiceWorker — the SW bootstrap (synchronous by design)'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          After the browser downloads <LineOfCode text='/sw.js' />, it executes the file. That file is the compiled
          output of <LineOfCode text='src/lib/ServiceWorker/initServiceWorker.ts' />. Here&apos;s what happens inside:
        </p>

        <CodeBlock
          language='typescript'
          code={`initServiceWorker();

function initServiceWorker() {
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
}`}
        />

        <MessageBox title='Why is initServiceWorker synchronous (not async)?'>
          When the browser parses a service worker script, event listeners must be attached{' '}
          <strong>synchronously during the initial execution</strong>. The browser does not wait for promises to resolve
          before deciding which events the SW handles. If you wrote{' '}
          <LineOfCode text='async function initServiceWorker()' /> and <LineOfCode text='await' />
          &apos;d something before adding listeners, the browser would finish parsing, see zero listeners, and the SW
          would be effectively dead — it would never respond to <LineOfCode text='install' />,{' '}
          <LineOfCode text='fetch' />, or <LineOfCode text='sync' /> events.
        </MessageBox>

        <FlowStep
          label='All listeners wired synchronously'
          detail='install, activate, fetch, and sync handlers are all attached in one synchronous pass — no awaits in between.'
          variant='success'
        />

        <Arrow />

        <FlowStep
          label='Async work happens inside the handlers, not before them'
          detail='Notice how IndexedDB init returns a promise that is consumed later inside the sync handler via event.waitUntil(). The key is: attach first, await later.'
          variant='default'
        />
      </Scene>

      {/* ── 3. cacheStaticAssets ────────────────────────────── */}
      <Scene badge='Step 3' title='cacheStaticAssets — making the app work offline'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This method runs during the <LineOfCode text='install' /> event. Its job is to pre-cache every static file the
          app needs to boot — so the next visit can be fully offline.
        </p>

        <FlowStep
          label='Cache the app shell'
          detail={
            <>
              Opens the static cache and adds the minimum files needed to render: <LineOfCode text='/' />,{' '}
              <LineOfCode text='/index.html' />, and <LineOfCode text='/vite.svg' />.
            </>
          }
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='Fetch the Vite manifest'
          detail={
            <>
              Calls <LineOfCode text="fetch('/vite-manifest.json')" /> to get the build manifest Vite generates during{' '}
              <LineOfCode text='pnpm build' />.
            </>
          }
          variant='default'
        />

        <MessageBox title='Why is the Vite manifest so important?'>
          <p className='mt-2'>
            <strong>Without the manifest, your app will crash offline with a white screen!</strong>
          </p>

          <p className='mt-2'>
            Here&apos;s the exact scenario: Vite code-splits your app — each route gets its own lazy-loaded JS chunk. If
            a user navigates to a page they haven&apos;t visited yet (e.g. via a React Router{' '}
            <LineOfCode text='<Link>' />
            ), the <LineOfCode text='cacheWithNetworkFallbackStrategy' /> won&apos;t find that route&apos;s chunk in the
            cache (it was never fetched before). It falls back to <LineOfCode text='/index.html' />, which loads fine —
            but then React Router reads the URL, tries to render the matching route, and requests the JS bundle for that
            page. That bundle isn&apos;t in the cache either, and you&apos;re offline, so the{' '}
            <LineOfCode text='<script>' /> tag fails to load. The result: a white screen and a broken app.
          </p>

          <p className='mt-2'>
            <strong>You need the vite-manifest.json!</strong> Ergo, <strong>you need to build your app</strong> and run
            it using
            <LineOfCode text='pnpm preview' />.
          </p>

          <p className='mt-2'>
            Every time you build your app, Vite hashes filenames (e.g. <LineOfCode text='index-a1b2c3d4.js' />
            ). The manifest maps source files to their hashed output paths. Without it, the SW would have no way to know
            which exact files to cache — the names change on every build. By reading the manifest, the SW can pre-cache{' '}
            <strong>every JS, CSS, and asset file</strong> your app needs, ensuring complete offline coverage.
          </p>

          <p className='mt-2'>
            The manifest solves this by letting the SW pre-cache <strong>all</strong> chunks at install time — even the
            ones for pages the user has never visited. Every lazy-loaded route chunk, every CSS split, every asset is
            already sitting in the cache before the user ever goes offline. No matter which <LineOfCode text='<Link>' />{' '}
            they click, the chunk is there.
          </p>
        </MessageBox>

        <Arrow />

        <FlowStep
          label='Parse and collect all asset URLs'
          detail={
            <>
              Extracts <LineOfCode text='entry.file' /> (JS/TS/HTML bundles) and <LineOfCode text='entry.css' /> (CSS
              chunks) from each manifest entry, deduplicates them, and caches them all.
            </>
          }
          variant='success'
        />

        <div className='border rounded-lg p-3 text-sm'>
          <div className='font-semibold mb-1'>The full method:</div>

          <CodeBlock
            code={`async cacheStaticAssets() {
  const staticCache = await caches.open(STATIC_CACHE_NAME);

  const appShell = ['/', '/index.html', '/vite.svg'];
  await staticCache.addAll(appShell);

  await this.precacheBuildAssets(staticCache);
}

private async precacheBuildAssets(cache: Cache) {
  const manifestResponse = await fetch('/vite-manifest.json');
  if (!manifestResponse.ok) return;

  const manifest = await manifestResponse.json();
  const assetUrls = Object.values(manifest).flatMap((entry: any) => {
    const urls: string[] = [];
    urls.push(\`/\${entry.file}\`);
    if (entry.css) urls.push(...entry.css.map((css: string) => \`/\${css}\`));
    return urls;
  });

  const uniqueUrls = [...new Set(assetUrls)];
  await cache.addAll(uniqueUrls);
}`}
            language='typescript'
          />
        </div>
      </Scene>

      {/* ── 4. cacheWithNetworkFallbackStrategy ─────────────── */}
      <Scene badge='Step 4' title='cacheWithNetworkFallbackStrategy — caching dynamic assets'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This method handles the <LineOfCode text='fetch' /> event. Every network request your app makes passes through
          here. It uses a <strong>cache-first</strong> strategy with intelligent fallbacks.
        </p>

        <FlowStep
          label='Check if the URL should be cached'
          detail={
            <>
              URLs matching the ignore list (e.g. <LineOfCode text='@vite' />, <LineOfCode text='chrome-extension://' />
              ) are fetched directly from the network — no caching.
            </>
          }
          variant='muted'
        />

        <Arrow />

        <FlowStep
          label='Look up the cache'
          detail={
            <>
              Calls <LineOfCode text='caches.match(requestUrl)' />. If a cached response exists, return it immediately —
              zero network latency.
            </>
          }
          variant='success'
        />

        <Arrow />

        <FlowStep
          label='Cache miss → fetch from network'
          detail='If nothing is in cache, the request goes to the network normally.'
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='Dynamically cache the response'
          detail={
            <>
              If the network response is <LineOfCode text='status 200' /> and <LineOfCode text="type 'basic'" />, the
              response is cloned and stored in the <strong>dynamic cache</strong>. Next time this URL is requested, it
              will be served from cache.
            </>
          }
          variant='success'
        />

        <Arrow />

        <FlowStep
          label='Network fails → offline fallback'
          detail={
            <>
              If the network is unreachable and the request is a page navigation, the SW returns the cached{' '}
              <LineOfCode text='/index.html' /> — keeping your SPA alive even offline.
            </>
          }
          variant='warn'
        />

        <MessageBox title='Static vs. Dynamic cache'>
          The static cache (filled during <LineOfCode text='install' />) contains the app shell and build assets — files
          you know upfront. The dynamic cache is a runtime safety net: it captures any successful request the user makes
          (API calls, lazy-loaded chunks, images) and stores them for future offline use. Together, they give you
          comprehensive offline coverage.
        </MessageBox>

        <div className='border rounded-lg p-3 text-sm'>
          <div className='font-semibold mb-1'>The full strategy:</div>

          <CodeBlock
            code={`async cacheWithNetworkFallbackStrategy(event: any) {
  const eventRequestUrl = event.request.url;
  const shouldBeCached = this.shouldBeCached(eventRequestUrl);

  try {
    if (!shouldBeCached) return await fetch(event.request);

    const cacheHit = await caches.match(eventRequestUrl);
    if (cacheHit) return cacheHit;

    const response = await fetch(event.request);

    if (response.status === 200 && response.type === 'basic') {
      await this.dynamicallyCacheResponse(event, response);
    }

    return response;
  } catch (error) {
    if (!shouldBeCached)
      return new Response('Offline', { status: 503 });

    if (event.request.mode === 'navigate')
      return caches.match('/index.html');

    return new Response('Offline', { status: 503 });
  }
}`}
            language='typescript'
          />
        </div>
      </Scene>

      {/* ── How to test ────────────────────────────────────── */}
      <Scene badge='Try it' title='How to test'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Verify the service worker is registered and working correctly.
        </p>

        <FlowStep
          label='1. Build the app & service worker'
          detail={
            <>
              Run <LineOfCode text='pnpm run build' /> so <LineOfCode text='src/public/sw.js' /> is generated alongside
              the <LineOfCode text='dist' /> folder.
            </>
          }
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='2. Start the preview server'
          detail={
            <>
              Run <LineOfCode text='pnpm preview' />, open this page, then open DevTools &rarr; Application &rarr;
              Service Workers. You should see the SW registered and &quot;activated and is running&quot;.
            </>
          }
          variant='default'
        />

        <Arrow />

        <FlowStep
          label='3. Test offline mode'
          detail='In DevTools → Network, set throttling to "Offline", then reload. The page should still load from the static and dynamic caches.'
          variant='success'
        />
      </Scene>
    </div>
  );
}
