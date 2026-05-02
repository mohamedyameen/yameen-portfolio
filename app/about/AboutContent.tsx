'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'
import { InlineMusicPlayer } from '@/components/music/MusicPlayer'

const livingWords = [
  { text: 'living', shine: 'shine-emerald', emoji: '🌿', tilt: 14 },
  { text: 'spark',  shine: 'shine-sky',     emoji: '💡', tilt: -12 },
  { text: 'kick',   shine: 'shine-orange',  emoji: '⚽', tilt: 18 },
  { text: 'laugh',  shine: 'shine-pink',    emoji: '😆', tilt: -16 },
  { text: 'vibe',   shine: 'shine-violet',  emoji: '✨', tilt: 12 },
]

const interests = [
  'Design', 'Gaming', 'Football', 'Coffee', 'Lofi',
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
    video: '/valorant.mp4',
  },
  {
    name: 'Apex Legends',
    tag: 'Battle Royale',
    detail: 'Trios with friends. Ash main — dash in, regret later.',
    gradient: 'from-orange-800 via-amber-950 to-neutral-950',
    accent: 'text-orange-300',
    image: '/apex.avif',
    video: '/apex.mp4',
  },
  {
    name: 'FIFA',
    tag: 'Football',
    detail: 'Weekend League on FUT. It\'s basically a second job.',
    gradient: 'from-emerald-800 via-teal-950 to-neutral-950',
    accent: 'text-emerald-300',
    image: '/fifa.jpg',
    video: '/fifa.mp4',
  },
]

const photos = [
  { src: '/valorant.jpg',     caption: 'Ranked queue' },
  { src: '/apex.avif',        caption: 'Trios night' },
  { src: '/fifa.jpg',         caption: 'FUT Saturday' },
  { src: '/golden-brown.png', caption: 'On loop' },
]

const stackPositions = [
  { rotate: -3, x: 0,   y: -7 },
  { rotate: 6,  x: 8,   y: -1 },
  { rotate: -8, x: -10, y: 3 },
  { rotate: 9,  x: 6,   y: 7 },
]

function PhotoStack() {
  const [topIdx, setTopIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setTopIdx((i) => (i + 1) % photos.length)
    }, 3500)
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const advance = () => {
    setTopIdx((i) => (i + 1) % photos.length)
    startTimer()
  }

  return (
    <div className="relative h-[200px] md:h-[220px] w-full">
      {photos.map((photo, i) => {
        const offset = (i - topIdx + photos.length) % photos.length
        const pos = stackPositions[offset]
        return (
          <motion.div
            key={photo.src}
            initial={false}
            animate={{
              rotate: pos.rotate,
              x: pos.x,
              y: pos.y,
              zIndex: photos.length - offset,
            }}
            transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
            whileHover={{ scale: 1.04, y: pos.y - 4 }}
            onClick={advance}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border p-2 pb-7 rounded-xl shadow-md cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.caption}
              className="block w-36 h-36 md:w-40 md:h-40 object-cover bg-muted rounded-lg"
            />
            <span
              className="absolute bottom-1 left-2 right-2 text-center text-sm text-muted-foreground"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              {photo.caption}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

function GameCard({ game, index }: { game: (typeof games)[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)

  const startVideo = () => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    v.muted = false
    v.volume = 0.5
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
    setIsActive(true)
  }

  const stopVideo = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setIsActive(false)
  }

  const toggle = () => {
    if (isActive) stopVideo()
    else startVideo()
  }

  return (
    <div
      className="group relative"
      data-active={isActive ? 'true' : undefined}
    >
      {game.name === 'FIFA' ? (
        <div
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap text-center"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          <span
            className="block text-base text-muted-foreground opacity-0 [transform:translateY(8px)_rotate(-6deg)] group-hover:opacity-100 group-hover:[transform:translateY(0)_rotate(-3deg)] group-data-[active=true]:opacity-100 group-data-[active=true]:[transform:translateY(0)_rotate(-3deg)] transition-all duration-[450ms] ease-out"
          >
            Ronaldo or Messi — they're better,
          </span>
          <span
            className="block text-xl font-bold text-foreground opacity-0 [transform:translateY(10px)_rotate(6deg)] group-hover:opacity-100 group-hover:[transform:translateY(-2px)_rotate(-4deg)] group-data-[active=true]:opacity-100 group-data-[active=true]:[transform:translateY(-2px)_rotate(-4deg)] transition-all duration-[550ms] delay-150 ease-out"
          >
            but for me, it's always <span className="underline decoration-wavy decoration-amber-500 dark:decoration-yellow-300 underline-offset-4">Neymar</span>.
          </span>
        </div>
      ) : null}

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      onMouseEnter={startVideo}
      onMouseLeave={stopVideo}
      onClick={toggle}
      className="relative overflow-hidden rounded-2xl border border-border cursor-pointer"
    >
      {game.image ? (
        <img
          src={game.image}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 group-data-[active=true]:opacity-0"
          style={{ objectPosition: game.name === 'Valorant' ? '75% 20%' : 'center center' }}
        />
      ) : null}
      {game.video ? (
        <video
          ref={videoRef}
          src={game.video}
          playsInline
          loop
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[active=true]:opacity-100"
        />
      ) : null}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} ${game.image ? 'opacity-60' : 'opacity-90'} transition-opacity duration-300 group-hover:opacity-30 group-data-[active=true]:opacity-30`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.07),transparent_60%)]" />
      <div className="relative flex flex-col gap-2 p-5 min-h-[160px] transition-opacity duration-300 group-hover:opacity-0 group-data-[active=true]:opacity-0">
        <span className={`text-xs uppercase tracking-widest font-medium ${game.accent}`}>{game.tag}</span>
        <span className="text-xl font-semibold tracking-tight text-white">{game.name}</span>
        <p className="text-xs text-white/65 leading-relaxed mt-auto">{game.detail}</p>
      </div>

    </motion.div>
    </div>
  )
}

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
      <section className="p-6 md:p-10 border-b border-border grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr] gap-6 md:gap-16">
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
                      className={`inline-block whitespace-nowrap text-shine ${livingWords[wordIdx].shine}`}
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
                    className="pointer-events-none select-none absolute -top-3 -right-4 text-2xl md:text-[1.5rem]"
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
            As a kid I took apart remotes and broke OS installs — turns out I
            just liked figuring out how things work. Did a computer science
            engineering degree, then drifted into design — where logic and feel
            finally clicked. These days I'm at Facilio, building AI-native tools
            for facilities teams, turning messy B2B problems into things that
            feel obvious. I care about craft, not about taking myself too
            seriously. Off the clock, you'll find me in ranked queue or watching
            football.
          </motion.p>
        </div>

        <PhotoStack />

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
      <section className="p-6 md:p-10 border-b border-border flex flex-col gap-6">
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
            <GameCard key={game.name} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* ── Connect ── */}
      <section className="p-6 md:p-10 flex flex-col gap-4">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="text-2xl md:text-3xl font-medium tracking-tight leading-[1.2] max-w-2xl"
          >
            You made it this far.{' '}
            <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-foreground/60">
              Reach out — say hi.
            </em>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="w-full md:max-w-[320px] md:flex-shrink-0"
          >
            <InlineMusicPlayer />
          </motion.div>
        </div>

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
      </section>

    </div>
  )
}
