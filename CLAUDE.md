# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Next.js version

This repo runs **Next.js 16.2.4 with React 19.2.4 and Tailwind CSS v4**. Many APIs you remember from older versions are gone or changed. Before touching routing, fonts, metadata, caching, or `params`/`searchParams`, consult `node_modules/next/dist/docs/` for the version actually installed — don't rely on training data.

A concrete example already in the codebase: dynamic route handlers receive `params` as a `Promise` (see `app/works/[slug]/page.tsx`).

## Commands

- `npm run dev` — start the dev server (Next 16 / Turbopack)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint via flat config (`eslint.config.mjs`); extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`

There is no test runner configured.

## Architecture

**App Router, RSC by default.** `app/layout.tsx` is the only place where global chrome lives: it loads fonts (local Geist + Google Playfair Display as CSS variables), wires `next-themes` (forced dark default, `enableSystem={false}`, custom storage key), mounts the persistent `Sidebar`, `SmoothScroll` (Lenis), and wraps children in `PageTransition` (Framer Motion).

**Content is split into data + body components, no MDX.** Two layers:

1. `content/works.ts` — pure-data registry (`works: Work[]`). **Never import React here.** This file is consumed by the client-side `MasonryGrid` and the slug page; React imports would bloat the home bundle.
2. `content/works/<slug>.tsx` — optional case-study body, default-exporting a React component. Use the primitives from `@/components/works/body` (`Section`, `Heading`, `Text`, `Img`, `Video`, `TwoCol`, `Callout`) and freely import any other component for interactive demos.

Bodies are wired via `content/works/bodies.ts`, a `Record<slug, () => import(...)>` map. Each entry is a dynamic import, so each body is code-split into its own route chunk. To add a body: create the `.tsx` file, then add one line to the map. Slugs without a body entry render header-only on `/works/<slug>`.

`app/works/[slug]/page.tsx` calls `generateStaticParams` over the `works` registry, so every entry becomes a statically generated route. The home grid (`MasonryGrid`) is driven by the same registry.

**Directory conventions.**
- `app/` — routes only (`/`, `/about`, `/works/[slug]`, `/api/weather`)
- `components/ui/` — shadcn-style primitives (`button`, `card`, `dialog`, `sheet`, `tabs`, `badge`, `marquee`, `FadeUp`)
- `components/layout/` — global chrome (Sidebar, Navbar, Footer, PageTransition, SmoothScroll, ThemeToggle, SoundToggle, LiveClock, TypewriterName, SidebarAmbient)
- `components/home/`, `components/works/` — page-specific composites
- `components/{aceternity,contact,profile,resume,mdx,sections}/` exist but are currently empty placeholders
- `hooks/` — `useSound`, `useWeather` (the latter pairs with `app/api/weather/route.ts`)
- `lib/utils.ts` — only the `cn()` helper (clsx + tailwind-merge)

**Styling.** Tailwind v4 via `@tailwindcss/postcss`. All theme tokens live in `app/globals.css` (CSS variables — no `tailwind.config.*`). shadcn is configured (`components.json`) with style `radix-lyra`, base color `neutral`, icon library `phosphor`, and the standard `@/*` aliases. Use `cn()` from `@/lib/utils` for class composition.

**Path alias.** `@/*` resolves from the repo root (see `tsconfig.json`), so imports look like `@/components/...`, `@/content/projects`, `@/lib/utils`.

**MCP / shadcn.** `.mcp.json` registers the shadcn MCP server — when adding new shadcn components, prefer the shadcn MCP tools over hand-writing primitives.

## Gotchas

- `package.json` has an `overrides` entry pinning `node-domexception` to a local stub in `shims/node-domexception/`. Don't remove it — it's there to silence/replace the deprecated upstream package. The shim is intentionally minimal.
- `app/layout.tsx` loads Geist via `localFont` pointing into `node_modules/geist/dist/...`. If you swap font strategies, keep the `--font-geist-sans` and `--font-playfair` CSS variables — they're referenced inline in `app/page.tsx` and elsewhere.
- Theme is forced dark (`defaultTheme="dark"`, `enableSystem={false}`). Don't reintroduce system theme without checking with the user.
