'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const interests = [
  'Design', 'Gaming', 'Football', 'Chai', 'Lofi', 'Cinema',
  'Running', 'AI tinkering', 'Typography', 'Photography', 'Late-night builds',
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

const currently = [
  { label: 'Reading',   value: 'Hooked — Nir Eyal' },
  { label: 'Listening', value: 'Fred again.. — Ten Days' },
  { label: 'Watching',  value: 'Severance, S2' },
  { label: 'Building',  value: 'AI-native dispatch flows at Facilio' },
]

const timeline = [
  { year: '2022 — now',  title: 'Lead Product Designer',  org: 'Facilio',   note: 'AI agents, design systems, complex B2B workflows.' },
  { year: '2023 — now',  title: 'Freelance Designer',      org: 'Various',   note: 'Mellow, Blue Whistle, Blubees.' },
  { year: '2017 – 2021', title: 'B.E. Computer Science',   org: 'Aalim Muhammed Salegh College', note: 'Stumbled into design, never looked back.' },
]

export default function AboutContent() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="px-5 md:px-10 py-12 md:py-16 border-b border-border flex flex-col gap-5">
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs tracking-widest uppercase text-muted-foreground"
        >
          The human side
        </motion.p>

        <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-[1.2] max-w-lg">
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
            things for a living.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.42 }}
          className="max-w-sm text-sm text-foreground/50 leading-relaxed"
        >
          Lead Product Designer based in Chennai — 4+ years turning complex B2B
          problems into experiences that feel obvious in hindsight. Off the clock,
          I'm either in ranked queue or watching football.
        </motion.p>
      </section>

      {/* ── Marquee ── */}
      <div className="border-b border-border py-4 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          className="flex whitespace-nowrap gap-8 text-xl md:text-2xl font-medium tracking-tight"
        >
          {[...interests, ...interests].map((w, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className={i % 3 === 0 ? 'text-foreground' : 'text-foreground/40'}>{w}</span>
              <span className="text-foreground/25">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── About + Currently ── */}
      <section className="px-5 md:px-10 py-12 md:py-16 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {/* Story */}
        <div className="flex flex-col gap-4">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-widest uppercase text-muted-foreground"
          >
            Who I am
          </motion.p>
          {[
            "Grew up curious — taking apart remotes, breaking OS installs, falling into design because it's where logic and feeling live together.",
            "I lead design at Facilio on AI-native tools for facilities teams. I've built design systems, shipped AI agents, and mentored designers across 4+ years of B2B SaaS.",
            "I care a lot about craft. Also about not taking myself too seriously.",
          ].map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-sm text-foreground/70 leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Currently */}
        <div className="flex flex-col gap-4">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-widest uppercase text-muted-foreground"
          >
            Currently
          </motion.p>
          <div className="flex flex-col gap-4">
            {currently.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-t border-border pt-3 flex flex-col gap-0.5"
              >
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{item.label}</span>
                <span className="text-sm text-foreground">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              className="group relative overflow-hidden rounded-lg border border-border cursor-default"
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
                <span className={`text-[10px] uppercase tracking-widest font-medium ${game.accent}`}>{game.tag}</span>
                <span className="text-xl font-semibold tracking-tight text-white">{game.name}</span>
                <p className="text-xs text-white/65 leading-relaxed mt-auto">{game.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Timeline + Connect ── */}
      <section className="px-5 md:px-10 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {/* Timeline */}
        <div className="flex flex-col gap-4">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-widest uppercase text-muted-foreground"
          >
            The road
          </motion.p>
          <div className="flex flex-col">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="grid grid-cols-[100px_1fr] gap-4 py-4 border-t border-border first:border-t-0"
              >
                <span className="text-xs text-muted-foreground pt-0.5">{item.year}</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {item.title} <span className="text-muted-foreground/60">· {item.org}</span>
                  </span>
                  <span className="text-xs text-foreground/50 leading-relaxed">{item.note}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-4 justify-start md:justify-center">
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
