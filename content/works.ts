/**
 * Pure-data registry of works. NEVER import React here.
 *
 * The masonry grid is a client component that imports this file —
 * adding React/components to this module would bloat the home page bundle.
 *
 * To add a new work:
 *   1. Append an entry to `works` below with the correct `type`.
 *   2. (Optional) Drop assets in `public/works/<slug>/`.
 *   3. For `case-study` or `component`: create `content/works/<slug>.tsx`
 *      and register it in `content/works/bodies.ts`.
 *      For `image` / `video`: set the `media` field — no body file needed.
 *
 * Card height is Pinterest-style: each work declares an `aspect`
 * (CSS aspect-ratio like '4/5', '1/1', '3/4', '16/9'). The cover fills
 * the column width and the height follows from the ratio.
 *
 * Open behavior is type-driven (see `MasonryGrid`):
 *   - case-study → bottom sheet (long-form scrollable)
 *   - component | image | video → centered modal
 */

export type WorkType = 'case-study' | 'component' | 'image' | 'video'

export type MediaAspect = '16/9' | '4/3' | '1/1' | '9/16' | '21/9'

/** Free-form credit row rendered in the case-study header. */
export type Credit = { label: string; names: string[] }

export type Work = {
  slug: string
  name: string
  type: WorkType
  tags: string[]
  category: string
  summary: string | null
  year: string
  role?: string
  client?: string
  kind?: 'work' | 'freelance'
  /** Disciplines this work covered, shown as tags on the grid card next to
   *  the company name. The Facilio AI agents are the only design + build;
   *  every other work is design only. Defaults to ['Design'] when omitted. */
  disciplines?: ('Design' | 'Dev')[]
  accent: string
  /** CSS aspect-ratio, e.g. '4/5', '1/1', '3/4', '16/9'. Defaults to '4/3'. */
  aspect?: string
  cover?: string
  /** CSS object-position for the `cover` image (e.g. '65% center', 'right').
   *  Lets a wide cover be framed toward one side when cropped into a tall
   *  card. Defaults to center. */
  coverPosition?: string
  /** Composed phone card preview: app screens in device frames floating
   *  over a backdrop (the PhoneScene look), for mobile products.
   *  Takes precedence over `heroPreview` and `cover` for the grid card. */
  heroScene?: {
    bg: string
    /** One screen renders a single upright centered phone cropped by the
     *  card's bottom edge; two render a staggered diagonal pair. */
    screens: string[]
  }
  /** Composed card preview: a product screenshot framed over a backdrop,
   *  anchored to one side and bleeding off the opposite edge + bottom
   *  (the SceneShot "cover" look), instead of a flat object-cover crop.
   *  Takes precedence over `cover` for the grid card. */
  heroPreview?: {
    src: string
    /** Optional backdrop behind the framed screenshot. When omitted, the
     *  screenshot frame fills the whole card (no backdrop, no bleed). */
    bg?: string
    anchor?: 'left' | 'right'
    /** object-position of the screenshot inside its frame. Default 'left top'. */
    focus?: string
  }
  /** Required for type='image' or type='video'. Ignored otherwise. */
  media?: {
    src: string
    aspect?: MediaAspect
    poster?: string
  }
  /** Optional case-study header fields. Rendered as small labels in the
   *  top metadata grid (Role / Time / Credits). `time` is free-form
   *  (e.g. "2025 Q2 – Present"). `credits` is a list of role/name groups. */
  time?: string
  credits?: Credit[]
  /** One-line summary of what you specifically contributed, shown as a
   *  column in the case-study meta strip (Role / Contribution / …). */
  contribution?: string
  /** Short tagline shown beneath the title in the case-study header. */
  tagline?: string
}

export const works: Work[] = [
  {
    slug: 'facilio-helpdesk-ai',
    name: 'Facilio Helpdesk',
    type: 'case-study',
    tags: ['AI', 'Facilities'],
    category: 'AI · Facilities Ops',
    summary:
      'A helpdesk for facilities teams run by three AI agents you configure, not three teams you staff — Intake answers the phone, chat, and email and raises the ticket; Dispatch matches the right technician against policies you wrote in plain English; Feedback closes the loop after the fix.',
    tagline:
      'A facilities helpdesk run by three configurable AI agents — Intake, Dispatch, and Feedback.',
    year: '2025',
    role: 'Lead Product Designer',
    time: '2025 – Present',
    client: 'Facilio',
    kind: 'work',
    disciplines: ['Design', 'Dev'],
    contribution:
      'Led design, copy, and frontend across all 11 modules — onboarding, the agents, and the operational surface.',
    accent: 'from-indigo-950 via-indigo-900 to-slate-950',
    aspect: '4/5',
    cover: '/works/facilio-helpdesk-ai/hero.jpg',
    coverPosition: 'center',
  },
  {
    slug: 'facilio-dispatcher-agent',
    name: 'Facilio Dispatcher Agent',
    type: 'case-study',
    tags: ['AI', 'Operations'],
    category: 'AI · Operations',
    summary:
      'An AI dispatch agent for field service teams — it auto-assigns the right technician to each work order based on skills, location, and current load, keeping the day routed without a dispatcher touching every ticket.',
    tagline:
      'An AI dispatch agent that auto-assigns field techs by skills, location, and current load.',
    year: '2025',
    role: 'Lead Product Designer',
    time: '2025 – Present',
    client: 'Facilio',
    kind: 'work',
    disciplines: ['Design', 'Dev'],
    accent: 'from-sky-950 via-blue-900 to-slate-950',
    aspect: '4/3',
  },
  {
    slug: 'fsm',
    name: 'Field Service Management',
    type: 'case-study',
    tags: ['Operations', 'B2B'],
    category: 'Operations · B2B',
    summary:
      'A dispatch console for field service teams that pairs a live map of technicians with drag-to-schedule work orders and inline status updates — built to make dispatchers 25% faster at routing the day.',
    tagline:
      'A dispatch console for field service teams — live map, drag-to-schedule, inline status.',
    year: '2023',
    role: 'Lead Product Designer',
    time: '2023',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-emerald-950 via-teal-900 to-slate-900',
    aspect: '3/4',
  },
  {
    slug: 'iot-automation',
    name: 'IoT Smart Control',
    type: 'case-study',
    tags: ['IoT', 'Mobile'],
    category: 'IoT · Facilio',
    summary:
      'A mobile smart-thermostat app for connected buildings — a live control panel for temperature, humidity, and fan, backed by comfort profiles, a day schedule, and one-off exceptions that keep climate on autopilot without fighting the automation.',
    tagline:
      'A mobile control panel for connected climate — set points, comfort profiles, schedules, and exceptions.',
    year: '2022',
    role: 'Lead Product Designer',
    time: '2022 – Present',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-cyan-950 via-sky-900 to-slate-900',
    aspect: '4/5',
    cover: '/works/iot-automation/home-on.jpg',
    coverPosition: 'top',
    heroScene: {
      bg: '/works/iot-automation/bg-atrium.jpg',
      screens: ['/works/iot-automation/home-on.jpg'],
    },
  },
  {
    slug: 'mellow',
    name: 'Mellow',
    type: 'case-study',
    tags: ['AI', 'Productivity'],
    category: 'AI · Freelance',
    summary:
      'A chat-first project tool that collapses team conversation and task tracking into a single surface, paired with an AI assistant that reads recent activity and surfaces what needs your attention before you ask.',
    tagline:
      'A chat-first project tool with an AI assistant that prioritises what needs your attention.',
    year: 'Feb 2024',
    role: 'Sole Product Designer',
    time: 'Feb 2024 – Apr 2024',
    client: 'Mellow',
    contribution:
      'Owned flows, interaction model, and visual system across 40+ screens — onboarding to shipped UI.',
    kind: 'freelance',
    accent: 'from-violet-950 via-purple-900 to-slate-900',
    aspect: '4/3',
    cover: '/works/mellow/hero-cover.jpg',
    heroPreview: {
      src: '/works/mellow/home-attention.jpg',
      bg: '/works/mellow/bg-sky.jpg',
      anchor: 'left',
      focus: 'left top',
    },
  },
  {
    slug: 'blubees',
    name: 'Blubees',
    type: 'case-study',
    tags: ['Healthcare', 'Recruitment'],
    category: 'Healthcare · Freelance',
    summary:
      'A three-sided hiring portal connecting hospitals, recruitment agencies, and medical professionals — running vetting, shortlisting, and onboarding inside a single workflow instead of scattered email threads.',
    tagline:
      'A three-sided hiring portal for hospitals, agencies, and medical professionals.',
    year: 'Jul 2023',
    role: 'Product Designer',
    time: 'Jul 2023 – Sep 2023',
    client: 'Blubees',
    kind: 'freelance',
    accent: 'from-rose-950 via-pink-900 to-slate-900',
    aspect: '1/1',
    cover: '/works/blubees/inst-home.jpg',
    coverPosition: 'top',
    heroScene: {
      bg: '/works/blubees/bg-showcase.png',
      screens: ['/works/blubees/inst-home.jpg'],
    },
  },
]
