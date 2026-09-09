'use client'

import { motion } from 'framer-motion'
import { ArrowUpRightIcon, BriefcaseIcon, MapPinIcon, MusicNoteIcon } from '@phosphor-icons/react'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

const facts: { label: string; value: string; icon: React.ReactNode }[] = [
  {
    label: 'Now',
    value: 'Lead Product Designer · Facilio',
    icon: <BriefcaseIcon size={13} />,
  },
  { label: 'Based', value: 'Chennai, India', icon: <MapPinIcon size={13} /> },
  { label: 'On loop', value: 'Lofi · Golden Brown', icon: <MusicNoteIcon size={13} /> },
]

const links = [
  { label: 'Email', href: 'mailto:mohamedyameen1999@gmail.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mohamed-yameen-83681315a' },
]

export default function InfoPanel() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-12 md:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.05 }}
        className="flex flex-col gap-2"
      >
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">
          Profile
        </span>
        <h1 className="text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
          Mohamed Yameen
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.15 }}
        className="grid grid-cols-1 gap-8 md:grid-cols-[1.5fr_1fr]"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-white/80 sm:text-base">
            Product Designer focused on AI-native B2B tools — workflow surfaces,
            data-dense dashboards, and Ask AI that holds up in production. I
            lead design at Facilio, where I spend most days turning messy
            facilities-management problems into interfaces that feel obvious.
          </p>
          <p className="text-sm leading-relaxed text-white/65">
            Came up through computer science. Drifted into design when I
            realised I cared more about how things felt than how cleanly they
            compiled. Slow work, but slow work is how the good stuff gets made.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {facts.map((f) => (
            <div
              key={f.label}
              className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm"
            >
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/45">
                {f.icon}
                {f.label}
              </span>
              <span className="text-sm text-white/85">{f.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.25 }}
        className="flex flex-wrap items-center gap-2"
      >
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs tracking-wider text-white/80 transition-colors hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            {l.label}
            <ArrowUpRightIcon size={13} />
          </a>
        ))}
      </motion.div>
    </div>
  )
}
