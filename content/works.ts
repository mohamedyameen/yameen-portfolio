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
  accent: string
  /** CSS aspect-ratio, e.g. '4/5', '1/1', '3/4', '16/9'. Defaults to '4/3'. */
  aspect?: string
  cover?: string
  /** Required for type='image' or type='video'. Ignored otherwise. */
  media?: {
    src: string
    aspect?: MediaAspect
    poster?: string
  }
}

export const works: Work[] = [
  {
    slug: 'facilio-atom',
    name: 'Facilio Atom',
    type: 'case-study',
    tags: ['AI', 'Platform'],
    category: 'AI · Platform',
    summary:
      'AI agents for facilities teams — one handles support across channels, the other auto-assigns field staff.',
    year: '2025',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-indigo-950 via-indigo-900 to-slate-950',
    aspect: '4/5',
  },
  {
    slug: 'design-system',
    name: 'Enterprise Design System',
    type: 'case-study',
    tags: ['Systems', 'B2B'],
    category: 'Systems · B2B SaaS',
    summary:
      '100+ components used by 10+ teams. Cut handoff time by 35% and design debt by 40%.',
    year: '2022 – present',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-stone-900 via-zinc-800 to-neutral-900',
    aspect: '4/3',
  },
  {
    slug: 'fsm',
    name: 'Field Service Management',
    type: 'case-study',
    tags: ['Operations', 'B2B'],
    category: 'Operations · B2B',
    summary:
      'Map-based dispatch, scheduling, and work orders for field teams. Made dispatchers 25% faster.',
    year: '2023',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-emerald-950 via-teal-900 to-slate-900',
    aspect: '3/4',
  },
  {
    slug: 'iot-automation',
    name: 'IoT Smart Control',
    type: 'case-study',
    tags: ['IoT', 'Automation'],
    category: 'IoT · Automation',
    summary:
      'Monitor and control 1000+ IoT devices. A visual rule builder cut setup time in half.',
    year: '2023',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-cyan-950 via-sky-900 to-slate-900',
    aspect: '16/9',
  },
  {
    slug: 'mellow',
    name: 'Mellow',
    type: 'case-study',
    tags: ['AI', 'Productivity'],
    category: 'AI · Freelance',
    summary:
      'A chat-first project tool with an AI assistant that prioritises your work. 40+ screens, dark and light.',
    year: 'Feb 2024',
    role: 'Product Designer',
    kind: 'freelance',
    accent: 'from-violet-950 via-purple-900 to-slate-900',
    aspect: '2/3',
  },
  {
    slug: 'blue-whistle',
    name: 'Blue Whistle',
    type: 'case-study',
    tags: ['EdTech', 'UX'],
    category: 'EdTech · Freelance',
    summary:
      'A learning platform where students simulate parliament — debates, law proposals, and role-based flows.',
    year: 'Nov 2023',
    role: 'Product Designer',
    kind: 'freelance',
    accent: 'from-blue-950 via-slate-900 to-slate-950',
    aspect: '1/1',
  },
  {
    slug: 'blubees',
    name: 'Blubees',
    type: 'case-study',
    tags: ['Healthcare', 'Recruitment'],
    category: 'Healthcare · Freelance',
    summary:
      'A hiring portal that connects hospitals, medical staff, and agencies in one place.',
    year: 'Jul 2023',
    role: 'Product Designer',
    kind: 'freelance',
    accent: 'from-rose-950 via-pink-900 to-slate-900',
    aspect: '9/16',
  },

  // --- Sample non-case-study works (replace media URLs / body with your own) ---

  {
    slug: 'palette-shift',
    name: 'Palette Shift',
    type: 'component',
    tags: ['Component', 'Color'],
    category: 'Interactive · Component',
    summary: 'A tiny interactive palette that re-rolls colour combinations on click.',
    year: '2024',
    accent: 'from-fuchsia-900 via-pink-900 to-rose-950',
    aspect: '4/3',
  },
  {
    slug: 'still-life',
    name: 'Still Life',
    type: 'image',
    tags: ['Photo'],
    category: 'Image',
    summary: 'A frame I keep coming back to.',
    year: '2024',
    accent: 'from-amber-900 via-orange-950 to-stone-950',
    aspect: '16/9',
    media: {
      src: 'https://picsum.photos/seed/stilllife/1600/1000',
      aspect: '16/9',
    },
  },
  {
    slug: 'colorful-animation',
    name: 'Colorful Animation Diversity',
    type: 'video',
    tags: ['Animation'],
    category: 'Video',
    summary: 'A short colourful motion piece.',
    year: '2024',
    accent: 'from-fuchsia-900 via-purple-900 to-indigo-950',
    aspect: '16/9',
    media: {
      src: '/works/colorful-animation/clip.mp4',
      aspect: '16/9',
    },
  },
]
