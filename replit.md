# DawnPix - Digital Photobooth App

## Overview

DawnPix is a playful digital photobooth web app with Y2K aesthetics, pastel colors, and sparkle effects. Users can take photos using their webcam, apply mood filters and seasonal frames, add text overlays, and download a classic photo strip.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/dawnpix)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **State management**: Zustand
- **Animations**: Framer Motion
- **Image export**: html-to-image

## Features

1. **Classic Strip Layout** — 2, 3, or 4 photo strips
2. **Countdown Timer** — 3, 5, or 10 second countdown before each shot
3. **Burst Mode** — takes multiple shots quickly, user picks their favorite
4. **AI Mood Filters** — dreamy, vintage, y2k, dark, cute (CSS/canvas filters)
5. **Seasonal Frames** — holiday, summer, birthday themed borders
6. **Custom Text Overlays** — add date, location, or a fun quote
7. **Glitter & Sparkle Effects** — animated effects on top of photos
8. **Dani's Daily Theme** — rotating daily photobooth challenge from API

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── dawnpix/         # React + Vite frontend (photobooth app)
│   └── api-server/      # Express API server
├── lib/
│   ├── api-spec/        # OpenAPI spec + Orval codegen config
│   ├── api-client-react/# Generated React Query hooks
│   ├── api-zod/         # Generated Zod schemas from OpenAPI
│   └── db/              # Drizzle ORM schema + DB connection
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Endpoints

- `GET /api/healthz` — Health check
- `GET /api/themes/daily` — Get today's Dani's Daily Theme
- `POST /api/sessions` — Save a photobooth session
- `GET /api/sessions` — List recent sessions

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client from OpenAPI spec

## Database

- `pnpm --filter @workspace/db run push` — push schema changes to dev DB
- Tables: `sessions` (stores photobooth session metadata)
