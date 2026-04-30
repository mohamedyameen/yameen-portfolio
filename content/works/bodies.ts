import type { ComponentType } from 'react'

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

type BodyLoader = () => Promise<{ default: ComponentType }>

export const bodyLoaders: Record<string, BodyLoader> = {
  'facilio-atom': () => import('./facilio-atom'),
  'palette-shift': () => import('./palette-shift'),
}
