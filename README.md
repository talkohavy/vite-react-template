# Vite + React Playground

A personal playground and reference app built with **Vite + React 19 + TypeScript**. Each route is a self-contained, interactive demo of a browser API, web platform feature, or UI pattern — useful as a living reference and a place to experiment.

## Tech Stack

| Layer           | Choice                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Build           | [rolldown-vite](https://github.com/rolldown/vite)                                                       |
| UI              | React 19, React Router v7, Tailwind CSS v4                                                              |
| State           | Redux Toolkit                                                                                           |
| HTTP            | Axios                                                                                                   |
| Realtime        | WebSocket, Socket.IO client                                                                             |
| Code quality    | ESLint (typescript-eslint, react-hooks, react-compiler, perfectionist), Biome (format), Prettier (JSON) |
| Tests           | Jest + Testing Library (jsdom)                                                                          |
| Package manager | pnpm                                                                                                    |

## Getting Started

```bash
pnpm install
pnpm dev          # http://localhost:3004
```

## Scripts

```bash
pnpm dev              # Start dev server (port 3004, --host)
pnpm build            # Build service worker then Vite production bundle
pnpm preview          # Serve the production build
pnpm test             # Run Jest test suite
pnpm tsc              # Type-check only (no emit)
pnpm lint             # ESLint
pnpm lint:fix         # ESLint --fix
pnpm format:biome:fix # Biome format --write
pnpm check            # lint + biome format + tsc + test (run before committing)
pnpm build:sw         # Rebuild only the service worker bundle (production)
```

## Project Structure

```
src/
├── pages/          # One folder per demo route
│   └── <Page>/
│       ├── <Page>.tsx       # Component
│       ├── index.ts         # Barrel export
│       ├── logic/           # Hooks, constants, types, utils
│       ├── tabs/            # Child route components
│       └── content/         # Page-local subcomponents
├── components/     # Shared component library (controls/, etc.)
├── lib/            # Framework-agnostic singletons (HttpClient, IndexedDB,
│                   #   SessionManager, WebSocketClient, SocketIOClient,
│                   #   ServiceWorker, syntaxHighlighter, TreeWalker)
├── store/          # Redux store + slices
├── common/         # Constants, types, utils, global styles
├── routes.ts       # Route definitions (data, not JSX) — nav is auto-generated
└── main.tsx        # App bootstrap + provider tree
```

To add a new page: create it under `src/pages/` and register it in `src/routes.ts`.

## Architecture

### Bootstrapping (`src/main.tsx`)

Startup is gated by `SuspenseUntilReady`, which runs an async init **before** rendering: `initSessionManager()`, `initHttpClient()`, then opens IndexedDB via `initIndexedDB()`. Provider nesting is fixed: `StoreProvider` → `BrowserRouter` → `DarkThemeProvider` → `WebSocketProvider` → `App`. The whole tree is wrapped in a development-only error boundary, and global `error`/`unhandledrejection` handlers feed `ReactErrorOverlay`. The service worker only registers when `VITE_SHOULD_REGISTER_SERVICE_WORKER === 'true'`.

### Routing (`src/routes.ts` + `src/App.tsx`)

Routes are **data, not JSX**: `routes` in `src/routes.ts` is an array of `Route` objects (`{ to, text, Component, index?, children? }`) with all page components `lazy()`-loaded. `App.tsx` renders them recursively (`renderRoute`) and mounts everything under the `BASE_URL` prefix. Nested routes (`children`) render as tabs via an `<Outlet>` in the parent page. **To add a page: create it under `src/pages/`, then register it in `src/routes.ts`** — the nav menu is generated from this same array.

### Page convention

Each page is a folder `src/pages/<PageName>/` containing:

- `<PageName>.tsx` — the component
- `index.ts` — barrel that default-exports the page (this is what `routes.ts` imports)
- `logic/` — non-render code: `use<PageName>Logic.ts` hook, `constants.ts`, `types.ts`, `utils/`
- `tabs/` — child route components when the page has nested routes
- `content/`, `components/` — page-local subcomponents

Components in `src/components/` follow the same `Folder/Component.tsx` + `index.ts` barrel pattern, often with a co-located `*.module.scss`.

### `src/lib/` — framework-agnostic singletons

Self-contained modules with an `init*` entry point, decoupled from React and initialized in `main.tsx`: `HttpClient` (axios wrapper), `IndexedDB`, `SessionManager`, `WebSocketClient`, `SocketIOClient`, `ServiceWorker`, `syntaxHighlighter`, `TreeWalker`. Treat these as the app's infrastructure layer.

### Service worker build (`build.config.js`)

The SW is **not** bundled by Vite. `build.config.js` uses esbuild to bundle `src/lib/ServiceWorker/initServiceWorker.ts` → `src/public/sw.js`. `pnpm build` runs this first. Edit SW logic under `src/lib/ServiceWorker/`, then rebuild.

### State (`src/store/`)

Redux Toolkit. `createStore(preloadedState)` combines reducers. Slices live in `src/store/slices/<feature>/` split into `slice.ts`, `selectors.ts`, `types.ts`, `index.ts`.

### Shared code (`src/common/`)

`constants/` (API URLs, IndexedDB schema, socket/SW/postMessage constants, localStorage keys — re-exported from `constants/index.ts`), `types/`, `utils/`, `styles/` (global CSS). `src/common/bootstrap.ts` imports global stylesheets and the syntax highlighter; it is imported once in `main.tsx`.

## Service Worker

The SW is built separately from Vite using esbuild (`build.config.js`).  
Source: `src/lib/ServiceWorker/initServiceWorker.ts` → `src/public/sw.js`

The SW only registers when `VITE_SHOULD_REGISTER_SERVICE_WORKER=true`.
