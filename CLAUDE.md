# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Vite + React 19 playground/demo app. Each route under `src/pages/` is a self-contained demo of a browser capability or pattern (Service Workers/PWA, IndexedDB, WebRTC, WebSocket, Socket.IO, Server-Sent Events, Screen/Media Capture, iframe communication, Web Workers, push notifications, a custom query language, virtualized tables/trees, etc.). It also doubles as a component library showcase (`src/components/controls`).

Package manager is **pnpm**. Use `pnpm` for installs; the `package.json` scripts are written against `npm run` but work with `pnpm run` too.

## Commands

```bash
pnpm dev                       # vite dev server (--host), port 3004 (override via VITE_PORT)
pnpm build                     # builds the service worker first (build:sw:dev), then vite build
pnpm preview                   # serve the production build
pnpm test                      # jest (jsdom)
pnpm test -- path/to/file.test.tsx   # run a single test file
pnpm test -- -t "name"               # run tests matching a name
pnpm tsc                       # tsc -p tsconfig.json (no emit)
pnpm lint                      # eslint
pnpm lint:fix                  # eslint --fix
pnpm format:biome:fix          # biome format --write ./src
pnpm check                     # lint + biome format + tsc check + test (run before considering work done)
pnpm build:sw                  # rebuild only the service worker bundle (production)
```

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

## Conventions (enforced by reviewers, partly by lint)

- **Relative imports only.** A `@src/*` alias exists in `vite.config.ts`/`tsconfig.json`, but the project convention is relative paths (`./`, `../`); follow that even though a few files use the alias.
- Use the controls in `src/components/controls` (Button, Input, Select, Checkbox, Toggle, etc.) for UI — don't hand-roll buttons/inputs.
- Prefer the `function` keyword for functions and components (not arrow consts). Functional components only.
- Destructure `props` inside the function body, never in the signature.
- Prefer `async/await` over `.then()/.catch()`; prefer optional chaining over `a && a.b`; prefer `Array.forEach` over `for...of`.
- Don't nest calls or return-await directly: store a function's result (and awaited results) in a variable before passing it on or returning it.
- Keep files under ~500 lines; split into modules when approaching it.

## Testing

Jest + Testing Library, jsdom environment. Tests are **co-located** with source as `*.test.ts(x)` / `*.spec.ts(x)`. For object assertions, build `expectedResult` and `actualResult` variables and assert `expect(actualResult).toEqual(expectedResult)`.

## Tooling notes

- Linting is **ESLint** (`eslint.config.mjs`, flat config with typescript-eslint, perfectionist, react-hooks, react-compiler). `oxlint` and `biome` are also present; Biome is used for formatting only. Prettier is configured but only used to check JSON/non-src files.
- Vite uses `rolldown-vite`, the React plugin, Tailwind v4 (`@tailwindcss/vite`), and `vite-plugin-svgr` (SVGs import as named React components — see the SvgImports page). `basic-ssl` for HTTPS dev is available but commented out.
- Only `VITE_`-prefixed env vars are exposed to the client.
