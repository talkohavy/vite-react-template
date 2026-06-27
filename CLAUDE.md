# CLAUDE.md

Guidance for Claude Code (and other AI agents) when working in this repository.

## 1. What this project is

Explained at the [README.md](./README.md) file:

## 2. Code Quality Standards

Code quality standard are found under: [code-quality-standards.md](./ai-docs/code-quality-standards.md)

## 3. Project Knowledge Base

Project knowledge base is found in all the md files under: `./ai-docs/knowledge/`

## 4. Commands

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
