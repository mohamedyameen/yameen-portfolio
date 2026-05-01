import { lazy, type ComponentType } from 'react'

/**
 * Registry of case-study body components, keyed by slug.
 *
 * Each entry is a dynamic import so each body is code-split into its own
 * route chunk — heavy interactive demos in one case study don't bloat
 * other pages or the home grid.
 *
 * Slugs without an entry render header-only on `/works/<slug>`.
 *
 * To add a body:
 *   1. Create `content/works/<slug>.tsx` exporting a default component.
 *   2. Add `'<slug>': () => import('./<slug>')` to the map below.
 */

/**
 * Bodies receive an optional `preview` flag — set to `true` when the
 * component renders inside a small thumbnail and should hide secondary
 * affordances like captions or counters. Bodies that don't care can
 * ignore the prop.
 */
export type BodyProps = { preview?: boolean }

type BodyLoader = () => Promise<{ default: ComponentType<BodyProps> }>

export const bodyLoaders: Record<string, BodyLoader> = {
  'facilio-atom': () => import('./facilio-atom'),
  'palette-shift': () => import('./palette-shift'),
}

/**
 * Pre-instantiated `lazy()` versions of every body, sharing a single
 * suspended chunk per slug across the modal, sheet, and grid thumbnail.
 */
export const lazyBodies: Record<string, ComponentType<BodyProps>> = Object.fromEntries(
  Object.entries(bodyLoaders).map(([slug, loader]) => [
    slug,
    lazy(loader) as unknown as ComponentType<BodyProps>,
  ]),
)
