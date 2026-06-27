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

## Service Worker

The SW is built separately from Vite using esbuild (`build.config.js`).  
Source: `src/lib/ServiceWorker/initServiceWorker.ts` → `src/public/sw.js`

The SW only registers when `VITE_SHOULD_REGISTER_SERVICE_WORKER=true`.
