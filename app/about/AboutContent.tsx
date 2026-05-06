'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Marquee } from '@/components/ui/marquee'
import { InlineMusicPlayer } from '@/components/music/MusicPlayer'

// ── Data ─────────────────────────────────────────────────────────
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
    detail: 'Ranked grinder. Duelist main, South Asia servers.',
    image: '/valorant.jpg',
    video: '/valorant.mp4',
    objectPosition: '75% 20%',
  },
  {
    name: 'Apex Legends',
    detail: 'Trios with friends. Ash main — dash in, regret later.',
    image: '/apex.avif',
    video: '/apex.mp4',
    objectPosition: 'center',
  },
  {
    name: 'FIFA',
    detail: "Weekend League on FUT. Basically a second job.",
    image: '/fifa.jpg',
    video: '/fifa.mp4',
    objectPosition: 'center',
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

// ── PhotoStack ───────────────────────────────────────────────────
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
    <div className="relative aspect-square w-full">
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
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] aspect-square bg-card border border-border p-2 rounded-xl shadow-md cursor-pointer flex flex-col gap-1.5"
          >
            <div className="flex-1 overflow-hidden rounded-lg bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                className="block w-full h-full object-cover"
              />
            </div>
            <span
              className="text-center text-[14px] text-muted-foreground leading-none pb-1"
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

// ── GameVideo ────────────────────────────────────────────────────
// Imperatively plays with audio; falls back to muted if the browser
// blocks autoplay-with-sound for the current user-gesture context.
function GameVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.currentTime = 0
    v.volume = 0.5
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
  }, [src])

  return (
    <video
      ref={ref}
      src={src}
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

// ── OffTheClock with single shared preview that travels between rows
function OffTheClock() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [lastIdx, setLastIdx] = useState(0)
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (hoveredIdx !== null) setLastIdx(hoveredIdx)
  }, [hoveredIdx])

  const targetIdx = hoveredIdx ?? lastIdx
  const targetRow = rowRefs.current[targetIdx]
  const previewY = targetRow
    ? targetRow.offsetTop + targetRow.offsetHeight / 2
    : 0
  const tilt = targetIdx % 2 === 0 ? -4 : 4
  const visible = hoveredIdx !== null
  const activeGame = hoveredIdx !== null ? games[hoveredIdx] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.74 }}
      className="flex flex-col gap-4"
    >
      <p className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-foreground/75">
        Most{' '}
        <em
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="italic font-bold text-foreground/85"
        >
          nights and weekends
        </em>
        , you&apos;ll find me deep in one of these —
      </p>

      <div className="relative">
        <ul className="flex flex-col">
          {games.map((g, i) => (
            <li
              key={g.name}
              ref={(el) => { rowRefs.current[i] = el }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onTouchStart={() => setHoveredIdx(i)}
              onTouchEnd={() => setHoveredIdx(null)}
              onTouchCancel={() => setHoveredIdx(null)}
              className="group cursor-pointer border-b border-border/40 last:border-b-0 select-none"
              data-active={hoveredIdx === i ? 'true' : undefined}
            >
              <div className="flex items-center gap-4 py-3">
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-[14px] border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.image}
                    alt={g.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ objectPosition: g.objectPosition }}
                  />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="text-[15px] sm:text-base font-medium text-foreground transition-colors">
                    {g.name}
                  </span>
                  <span className="text-[13px] sm:text-sm text-foreground/55 leading-snug">
                    {g.detail}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Single shared preview — slides between rows, tilt alternates */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            opacity: visible ? 1 : 0,
            scale: visible ? 1 : 0.92,
            rotate: tilt,
            y: previewY,
          }}
          transition={{
            opacity: { duration: 0.22, ease: 'easeOut' },
            scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
          className="pointer-events-none absolute right-2 sm:right-4 top-0 z-10"
        >
          <div className="-translate-y-1/2 w-44 sm:w-72 aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-2xl shadow-black/40 relative">
            <AnimatePresence mode="wait">
              {activeGame && (
                <motion.div
                  key={activeGame.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0"
                >
                  <GameVideo src={activeGame.video} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}


// ── Animated headline ────────────────────────────────────────────
function AnimatedHeadline() {
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % livingWords.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-[1.2] w-full text-balance">
      <span className="block">
        {['Hey,', "I'm", 'Yameen.'].map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 + i * 0.06 }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </span>
      <motion.span
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
        className="block text-muted-foreground"
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
          <span className="inline-block" style={{ clipPath: 'inset(0)', lineHeight: 1.2 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={livingWords[wordIdx].text}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
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
              className="pointer-events-none select-none absolute -top-3 -right-3 sm:-right-4 text-xl sm:text-2xl md:text-[1.5rem]"
              aria-hidden
            >
              {livingWords[wordIdx].emoji}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </h1>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function AboutContent() {
  return (
    <div className="flex flex-col">
      {/* ── Info ── */}
      <section className="p-6 md:p-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-10 sm:gap-12 lg:gap-14">
          {/* ── Photo: sidebar at lg+, inline next to headline below ── */}
          <aside className="hidden lg:block lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <PhotoStack />
            </motion.div>
          </aside>

          {/* ── Headline + bio ── */}
          <div className="lg:order-2 flex flex-col gap-8 sm:gap-10">
            <div className="flex flex-col gap-6 sm:gap-8">
              <AnimatedHeadline />
              {/* Inline photo stack — mobile/tablet only, below the title */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-56 sm:w-60 md:w-64 lg:hidden"
              >
                <PhotoStack />
              </motion.div>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6 w-full">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.42 }}
                className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-foreground/85"
              >
                Product Designer focused on AI-native B2B tools — workflow
                surfaces, data-dense dashboards, and copilots that hold up in
                production. I lead design at Facilio, where I spend most days
                turning messy facilities-management problems into interfaces
                that feel obvious.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5 }}
                className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-foreground/75"
              >
                I came up through computer science engineering, expecting to
                ship systems and write features. Somewhere along the way I
                noticed I cared less about how cleanly things compiled and more
                about how they felt to use — the small frictions, the tiny
                delights, the way a button can feel honest or sneaky. So I
                drifted, slowly, into design, and never really came back.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.58 }}
                className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-foreground/65"
              >
                These days I obsess over craft — shipping things that earn
                their weight, keeping the design language tight, chasing the
                version that <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-foreground/80">feels right</em> over the one that&apos;s just done.
                It&apos;s slow work, but slow work is how the good stuff gets
                made.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.66 }}
                className="text-[15px] sm:text-base md:text-[17px] leading-relaxed text-foreground/65"
              >
                Most evenings, headphones in and{' '}
                <InlineMusicPlayer />
                {' '}on loop, you&apos;ll find me deep in a Figma file or
                sneaking in a Valorant queue between iterations — coffee within
                reach, the usual late-night build energy. If any of this
                resonates, say hi at{' '}
                <a
                  href="mailto:mohamedyameen1999@gmail.com"
                  className="text-foreground underline decoration-foreground/30 hover:decoration-foreground underline-offset-[3px] transition-colors break-all"
                >
                  mohamedyameen1999@gmail.com
                </a>{' '}
                or find me on{' '}
                <a
                  href="https://linkedin.com/in/mohamed-yameen-83681315a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline decoration-foreground/30 hover:decoration-foreground underline-offset-[3px] transition-colors"
                >
                  LinkedIn
                </a>
                . I&apos;m easy to reach.
              </motion.p>

              <OffTheClock />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
