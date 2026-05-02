'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'

const livingWords = [
  { text: 'living', gradient: 'from-emerald-200 via-emerald-300 to-emerald-400', emoji: '🌿', tilt: 14 },
  { text: 'reason', gradient: 'from-sky-200 via-sky-300 to-sky-400',             emoji: '💡', tilt: -12 },
  { text: 'kick',   gradient: 'from-orange-200 via-orange-300 to-orange-400',    emoji: '⚽', tilt: 18 },
  { text: 'laugh',  gradient: 'from-pink-200 via-pink-300 to-pink-400',          emoji: '😆', tilt: -16 },
  { text: 'vibe',   gradient: 'from-violet-200 via-violet-300 to-violet-400',    emoji: '✨', tilt: 12 },
]

const interests = [
  'Design', 'Gaming', 'Football', 'Chai', 'Lofi',
  'AI tinkering', 'Vibe coding', 'Late-night builds',
]

const games = [
  {
    name: 'Valorant',
    tag: 'Tactical FPS',
    detail: 'Ranked grinder. Duelist main, South Asia servers.',
    gradient: 'from-rose-900 via-red-950 to-black',
    accent: 'text-rose-300',
    image: '/valorant.jpg',
  },
  {
    name: 'Apex Legends',
    tag: 'Battle Royale',
    detail: 'Trios with friends. Wraith main — I take fights I shouldn\'t.',
    gradient: 'from-orange-800 via-amber-950 to-neutral-950',
    accent: 'text-orange-300',
    image: '/apex.jpg',
  },
  {
    name: 'FIFA',
    tag: 'Football',
    detail: 'Weekend League on FUT. It\'s basically a second job.',
    gradient: 'from-emerald-800 via-teal-950 to-neutral-950',
    accent: 'text-emerald-300',
    image: '/fifa.jpg',
  },
]

const timeline = [
  { year: '2022 — now',  title: 'Lead Product Designer',  org: 'Facilio',   note: 'AI agents, design systems, complex B2B workflows.' },
  { year: '2023 — now',  title: 'Freelance Designer',      org: 'Various',   note: 'Mellow, Blue Whistle, Blubees.' },
  { year: '2017 – 2021', title: 'B.E. Computer Science',   org: '', note: 'Stumbled into design, never looked back.' },
]

export default function AboutContent() {
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % livingWords.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="px-6 md:px-10 py-10 md:py-16 border-b border-border grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr] gap-12 md:gap-20 md:items-start">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-[1.2] max-w-2xl">
            {['Hey,', "I'm", 'Yameen.'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.06 }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="inline-block text-muted-foreground"
            >
              I{' '}
              <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-foreground">
                design
              </em>{' '}
              things for a{' '}
              <span
                className="relative inline-block"
                style={{ marginLeft: '0.15em' }}
              >
                <span
                  className="inline-block"
                  style={{ clipPath: 'inset(0)', lineHeight: 1.2 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={livingWords[wordIdx].text}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                      className={`inline-block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r ${livingWords[wordIdx].gradient}`}
                    >
                      {livingWords[wordIdx].text}.
                    </motion.span>
                  </AnimatePresence>
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={livingWords[wordIdx].text + '-emoji'}
                    initial={{ y: 14, x: -10, rotate: -30, scale: 0.4, opacity: 0 }}
                    animate={{ y: 0, x: 0, rotate: livingWords[wordIdx].tilt, scale: 1, opacity: 1 }}
                    exit={{ y: -18, x: 14, rotate: 40, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    className="pointer-events-none select-none absolute -top-3 -right-7 text-2xl md:text-[1.5rem]"
                    aria-hidden
                  >
                    {livingWords[wordIdx].emoji}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.42 }}
            className="max-w-2xl text-sm text-foreground/60 leading-relaxed"
          >
            I'm a Lead Product Designer based in Chennai. As a kid I took apart
            remotes and broke OS installs — turns out I just liked figuring out
            how things work. Design is where I do that for a living. These days
            I lead design at Facilio, building AI-native tools for facilities
            teams, turning messy B2B problems into things that feel obvious. I
            care about craft, not about taking myself too seriously. Off the
            clock, you'll find me in ranked queue or watching football.
          </motion.p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
                className="grid grid-cols-[100px_1fr] gap-4 py-4 border-t border-border first:border-t-0"
              >
                <span className="text-xs text-muted-foreground pt-0.5">{item.year}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {item.title}
                    {item.org && <span className="text-muted-foreground/60"> · {item.org}</span>}
                  </span>
                  <span className="text-xs text-foreground/50 leading-relaxed">{item.note}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-b border-border py-4">
        <Marquee
          className="[--duration:32s] [--gap:2rem] text-xl md:text-2xl font-medium tracking-tight"
          repeat={3}
        >
          {interests.map((w, i) => (
            <span key={w} className="flex items-center gap-8">
              <span className={i % 3 === 0 ? 'text-foreground' : 'text-foreground/40'}>{w}</span>
              <span className="text-foreground/25">·</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── Off the clock ── */}
      <section className="px-5 md:px-10 py-12 md:py-16 border-b border-border flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-widest uppercase text-muted-foreground"
          >
            Off the clock
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="text-2xl md:text-3xl font-medium tracking-tight leading-[1.2]"
          >
            When I'm not designing,{' '}
            <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-foreground/60">
              I'm playing.
            </em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {games.map((game, i) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border cursor-default"
            >
              {game.image ? (
                <img
                  src={game.image}
                  alt={game.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: game.name === 'Valorant' ? '75% 20%' : 'center center' }}
                />
              ) : null}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} ${game.image ? 'opacity-60' : 'opacity-90'}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.07),transparent_60%)]" />
              <div className="relative flex flex-col gap-2 p-5 min-h-[160px]">
                <span className={`text-xs uppercase tracking-widest font-medium ${game.accent}`}>{game.tag}</span>
                <span className="text-xl font-semibold tracking-tight text-white">{game.name}</span>
                <p className="text-xs text-white/65 leading-relaxed mt-auto">{game.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Connect ── */}
      <section className="px-5 md:px-10 py-12 md:py-16">
        <div className="flex flex-col gap-4">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-widest uppercase text-muted-foreground"
          >
            Say hi
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="text-2xl md:text-3xl font-medium tracking-tight leading-[1.2]"
          >
            Let's build something{' '}
            <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-foreground/60">
              together.
            </em>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="flex flex-col gap-2 text-sm"
          >
            <a href="mailto:mohamedyameen1999@gmail.com" className="group flex items-center gap-1.5 text-foreground hover:text-foreground/60 transition-colors w-fit">
              mohamedyameen1999@gmail.com
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a href="https://linkedin.com/in/mohamed-yameen-83681315a" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-foreground hover:text-foreground/60 transition-colors w-fit">
              LinkedIn
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a href="tel:+919940677476" className="text-foreground hover:text-foreground/60 transition-colors w-fit">
              +91 99406 77476
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
