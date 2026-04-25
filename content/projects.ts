/**
 * Single source of truth for all projects.
 *
 * To add a new case study:
 *   1. Append an entry to the `projects` array below.
 *   2. Drop assets into public/works/<slug>/.
 *   3. Compose `blocks` using the Block union — any mix of
 *      heading, text, image, or video in any order.
 *
 * `coverHeight` controls the card's cover area:
 *   'sm'  → short   (~160px)
 *   'md'  → medium  (~220px)
 *   'lg'  → tall    (~320px)
 *   'xl'  → extra   (~420px)
 *   '2xl' → huge    (~512px)
 *
 * Vary these across cards to get a natural Pinterest rhythm.
 */

export type CoverHeight = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type Block =
  | { type: 'heading'; content: string }
  | { type: 'text'; content: string }
  | {
      type: 'image'
      src: string
      alt?: string
      caption?: string
      aspect?: '16/9' | '4/3' | '1/1' | '9/16' | '21/9'
    }
  | {
      type: 'video'
      src: string
      poster?: string
      caption?: string
      autoplay?: boolean
      loop?: boolean
      muted?: boolean
    }

export type Project = {
  slug: string
  name: string
  tags: string[]
  category: string
  summary: string | null
  year: string
  role?: string
  client?: string
  kind?: 'work' | 'freelance'
  accent: string
  coverHeight?: CoverHeight
  cover?: string
  blocks?: Block[]
}

export const projects: Project[] = [
  {
    slug: 'facilio-atom',
    name: 'Facilio Atom',
    tags: ['AI', 'Platform'],
    category: 'AI · Platform',
    summary:
      'AI agents for facilities teams — one handles support across channels, the other auto-assigns field staff.',
    year: '2025',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-indigo-950 via-indigo-900 to-slate-950',
    coverHeight: 'xl',
    blocks: [
      { type: 'heading', content: 'Overview' },
      {
        type: 'text',
        content:
          "Facilio Atom is the company's AI application platform for facilities and operations teams. I led design for two core AI agents running in live customer environments.",
      },
    ],
  },
  {
    slug: 'design-system',
    name: 'Enterprise Design System',
    tags: ['Systems', 'B2B'],
    category: 'Systems · B2B SaaS',
    summary:
      '100+ components used by 10+ teams. Cut handoff time by 35% and design debt by 40%.',
    year: '2022 – present',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-stone-900 via-zinc-800 to-neutral-900',
    coverHeight: 'md',
    blocks: [],
  },
  {
    slug: 'fsm',
    name: 'Field Service Management',
    tags: ['Operations', 'B2B'],
    category: 'Operations · B2B',
    summary:
      'Map-based dispatch, scheduling, and work orders for field teams. Made dispatchers 25% faster.',
    year: '2023',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-emerald-950 via-teal-900 to-slate-900',
    coverHeight: 'lg',
    blocks: [],
  },
  {
    slug: 'iot-automation',
    name: 'IoT Smart Control',
    tags: ['IoT', 'Automation'],
    category: 'IoT · Automation',
    summary:
      'Monitor and control 1000+ IoT devices. A visual rule builder cut setup time in half.',
    year: '2023',
    role: 'Lead Product Designer',
    client: 'Facilio',
    kind: 'work',
    accent: 'from-cyan-950 via-sky-900 to-slate-900',
    coverHeight: 'sm',
    blocks: [],
  },
  {
    slug: 'mellow',
    name: 'Mellow',
    tags: ['AI', 'Productivity'],
    category: 'AI · Freelance',
    summary:
      'A chat-first project tool with an AI assistant that prioritises your work. 40+ screens, dark and light.',
    year: 'Feb 2024',
    role: 'Product Designer',
    kind: 'freelance',
    accent: 'from-violet-950 via-purple-900 to-slate-900',
    coverHeight: 'lg',
    blocks: [],
  },
  {
    slug: 'blue-whistle',
    name: 'Blue Whistle',
    tags: ['EdTech', 'UX'],
    category: 'EdTech · Freelance',
    summary:
      'A learning platform where students simulate parliament — debates, law proposals, and role-based flows.',
    year: 'Nov 2023',
    role: 'Product Designer',
    kind: 'freelance',
    accent: 'from-blue-950 via-slate-900 to-slate-950',
    coverHeight: 'md',
    blocks: [],
  },
  {
    slug: 'blubees',
    name: 'Blubees',
    tags: ['Healthcare', 'Recruitment'],
    category: 'Healthcare · Freelance',
    summary:
      'A hiring portal that connects hospitals, medical staff, and agencies in one place.',
    year: 'Jul 2023',
    role: 'Product Designer',
    kind: 'freelance',
    accent: 'from-rose-950 via-pink-900 to-slate-900',
    coverHeight: 'xl',
    blocks: [],
  },
]
