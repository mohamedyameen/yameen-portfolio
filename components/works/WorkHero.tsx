'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Work } from '@/content/works'
import { PhoneFrame, SHOWCASE_BG, bgStyle } from '@/components/works/PhoneScene'

/* ────────────────────────────────────────────────────────────────────── */
/*  WorkHero                                                               */
/*                                                                         */
/*  Replaces the flat gradient cover at the top of a case study. For works */
/*  with a bespoke showcase (currently Mellow) it renders a cinematic      */
/*  backdrop with the product framed as floating app windows; every other  */
/*  work falls back to the original accent gradient so nothing regresses.  */
/* ────────────────────────────────────────────────────────────────────── */

export function WorkHero({ work }: { work: Work }) {
  if (work.slug === 'mellow') return <MellowShowcase />
  if (work.slug === 'blubees') return <BlubeesShowcase />
  if (work.slug === 'iot-automation') return <IotShowcase />
  if (work.slug === 'facilio-helpdesk-ai') return <HelpdeskShowcase />

  return (
    <div
      className={`w-full bg-gradient-to-br ${work.accent} rounded-2xl aspect-[16/9]`}
      role="img"
      aria-label={work.name}
    />
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Facilio Helpdesk — a full-bleed cinematic backdrop, brand lockup on    */
/*  top. No device frames: this is a web product, so the hero is the       */
/*  atmosphere rather than floating screens.                               */
/* ────────────────────────────────────────────────────────────────────── */

function HelpdeskShowcase() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
      <div className="relative aspect-[16/9]">
        <Image
          src="/works/facilio-helpdesk-ai/hero.jpg"
          alt="Facilio Helpdesk"
          fill
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
          priority
        />
        {/* Gentle wash to seat the image in the page. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  A single browser-style window frame around a product screenshot.      */
/* ────────────────────────────────────────────────────────────────────── */

function WindowMock({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-white shadow-2xl shadow-black/40 ring-1 ring-black/10 sm:rounded-xl">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 90vw, 720px"
        className="object-cover object-top"
        priority
      />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Blubees — app screens as floating iPhones over the hive backdrop.     */
/* ────────────────────────────────────────────────────────────────────── */

function BlubeesShowcase() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
      <div className="relative aspect-[4/3] sm:aspect-[16/9]" style={SHOWCASE_BG}>
        {/* Brand lockup */}
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          <span
            className="text-sm text-neutral-800 sm:text-base"
            style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '0.02em' }}
          >
            Blubees
          </span>
        </div>

        {/* Left phone — institutions (md+ only). */}
        <motion.div
          className="absolute left-[12%] top-[20%] hidden w-[22%] md:block"
          initial={{ opacity: 0, y: 48, rotate: -13 }}
          animate={{ opacity: 1, y: 0, rotate: -8 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <PhoneFrame
            src="/works/blubees/job-create.jpg"
            alt="Blubees — create a job"
            sizes="(max-width: 1152px) 22vw, 254px"
          />
        </motion.div>

        {/* Center phone — the professional home. */}
        <motion.div
          className="absolute left-[16%] top-[10%] w-[36%] sm:left-[39%] sm:w-[23%]"
          initial={{ opacity: 0, y: 64 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
        >
          <PhoneFrame
            src="/works/blubees/inst-home.jpg"
            alt="Blubees — institution home"
            sizes="(max-width: 1152px) 36vw, 265px"
            priority
          />
        </motion.div>

        {/* Right phone — the doctor profile. */}
        <motion.div
          className="absolute left-[56%] top-[24%] w-[36%] sm:left-[65%] sm:w-[22%]"
          initial={{ opacity: 0, y: 48, rotate: 11 }}
          animate={{ opacity: 1, y: 0, rotate: 6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <PhoneFrame
            src="/works/blubees/doctor-profile.jpg"
            alt="Blubees — doctor profile"
            sizes="(max-width: 1152px) 36vw, 254px"
          />
        </motion.div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  IoT Smart Control — one hero phone, two peeking behind for depth.     */
/*  Deliberately calmer than Blubees: a single dominant control panel,    */
/*  supporting screens softly set back, lots of quiet blue around it.      */
/* ────────────────────────────────────────────────────────────────────── */

function IotShowcase() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
      <div className="relative aspect-[4/3] sm:aspect-[16/9]">
        {/* Crisp atrium cover + gradient wash, so the phones read as the hero
            object without softening the cover image itself. */}
        <div
          className="absolute inset-0"
          style={bgStyle('/works/iot-automation/bg-atrium.jpg')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/15" />

        {/* Brand lockup — white for the darker cinematic backdrop. */}
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-20">
          <span
            className="text-sm text-white/95 sm:text-base [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]"
            style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '0.02em' }}
          >
            IoT Smart Control
          </span>
        </div>

        {/* Soft radial glow to seat the hero phone in the centre and lift it
            off the busy atrium. */}
        <div
          className="absolute left-1/2 top-1/2 h-[85%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,255,255,0.5), rgba(255,255,255,0))',
          }}
        />

        {/* Left supporting phone — comfort profiles, set back (md+ only). */}
        <motion.div
          className="absolute left-[20%] top-[26%] z-0 hidden w-[19%] md:block"
          initial={{ opacity: 0, y: 40, rotate: -12 }}
          animate={{ opacity: 0.85, y: 0, rotate: -9 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <PhoneFrame
            src="/works/iot-automation/comfort-list.jpg"
            alt="IoT Smart Control — comfort profiles"
            sizes="(max-width: 1152px) 19vw, 219px"
          />
        </motion.div>

        {/* Right supporting phone — the day schedule, set back (md+ only). */}
        <motion.div
          className="absolute left-[61%] top-[26%] z-0 hidden w-[19%] md:block"
          initial={{ opacity: 0, y: 40, rotate: 12 }}
          animate={{ opacity: 0.85, y: 0, rotate: 9 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
        >
          <PhoneFrame
            src="/works/iot-automation/schedule-timeline.jpg"
            alt="IoT Smart Control — the day schedule"
            sizes="(max-width: 1152px) 19vw, 219px"
          />
        </motion.div>

        {/* Hero phone — the live control panel, centred and upright. */}
        <motion.div
          className="absolute left-1/2 top-[11%] z-10 w-[38%] -translate-x-1/2 sm:w-[24%]"
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <PhoneFrame
            src="/works/iot-automation/home-on.jpg"
            alt="IoT Smart Control — the live control panel"
            sizes="(max-width: 1152px) 38vw, 277px"
            priority
          />
        </motion.div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Mellow — screens floating over the cinematic sky backdrop.            */
/* ────────────────────────────────────────────────────────────────────── */

function MellowShowcase() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-border bg-[#2f74b3]">
      <div className="relative aspect-[16/10] sm:aspect-[16/9]">
        {/* Cinematic backdrop — a paper plane over a calm valley, echoing
            Mellow's send icon and its "tranquil" brand. */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/works/mellow/bg-sky.jpg"
            alt="Cinematic sky with a paper plane over a valley"
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Grounding wash so the windows sit in the scene rather than on it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        {/* Brand lockup */}
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/works/mellow/logo.svg"
            alt="Mellow"
            className="h-4 w-auto sm:h-5"
          />
        </div>

        {/* Secondary window — peeks in from behind for depth (md+ only). */}
        <motion.div
          className="absolute -bottom-[12%] -left-[2%] hidden w-[54%] rotate-[-9deg] md:block"
          initial={{ opacity: 0, y: 40, rotate: -14 }}
          animate={{ opacity: 1, y: 0, rotate: -9 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <WindowMock
            src="/works/mellow/discussions.jpg"
            alt="Mellow discussion thread"
          />
        </motion.div>

        {/* Primary window — rises from the bottom, tilted, bleeding off edge. */}
        <motion.div
          className="absolute -bottom-[20%] left-1/2 w-[98%] -translate-x-1/2 rotate-[-3deg] sm:w-[84%] md:left-[54%]"
          initial={{ opacity: 0, y: 60, rotate: -7 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
        >
          <WindowMock
            src="/works/mellow/home-attention.jpg"
            alt="Mellow home — the AI Attention Hub"
          />
        </motion.div>
      </div>
    </div>
  )
}
