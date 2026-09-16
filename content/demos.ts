/**
 * The live-console demos, as pure data — no React, like `content/works.ts`.
 *
 * `WorkHero` reads from here to decide which works get a live console in the
 * hero instead of a picture, and `DemoChrome` turns the views into the browser
 * tabs across the top of the window.
 */

export type DemoView = {
  label: string
  /** Route inside the console, e.g. '/helpdesk/tickets'. */
  path: string
}

export type Demo = {
  /** Window/document title, and the iframe's accessible name. */
  title: string
  /** Names the product in the hero's backdrop alt text. */
  alt: string
  /** The product's mark, light-on-dark, for the browser tabs in the chrome. */
  favicon: string
  views: DemoView[]
}

export const demos: Record<string, Demo> = {
  'facilio-helpdesk-ai': {
    title: 'Facilio Helpdesk — product demo',
    alt: 'Facilio Helpdesk',
    favicon: '/helpdesk/favicon-dark.png',
    views: [
      { label: 'Home', path: '/helpdesk/home' },
      // Boots the console as a fresh account so the first-run flow can be
      // walked: URL → crawl → "Here's What We Found" → agent → Ask AI.
      { label: 'Onboarding', path: '/helpdesk/onboarding?demo=onboarding' },
      { label: 'Intake agent', path: '/helpdesk/intake' },
      { label: 'Ask AI', path: '/helpdesk/copilot' },
    ],
  },
  'facilio-dispatcher-agent': {
    title: 'Facilio Dispatcher — product demo',
    alt: 'Facilio Dispatcher Agent',
    // The console's own Dispatcher mark (product.ts) in white — the same
    // shape it swaps in as the document favicon when it boots as Dispatcher.
    favicon: '/helpdesk/dispatcher-mark-dark.svg',
    views: [
      { label: 'Policies', path: '/dispatcher-agent/dispatch/policies' },
      { label: 'Tickets', path: '/dispatcher-agent/tickets' },
      { label: 'Technicians', path: '/dispatcher-agent/dispatch/technicians' },
    ],
  },
}
