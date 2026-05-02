'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { useMusicPlayer } from './MusicPlayerProvider'

function Leaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 7,
        size: 16 + Math.random() * 18,
        rotateStart: Math.random() * 360,
        rotateEnd: Math.random() * 720 - 360,
        drift: (Math.random() - 0.5) * 30,
        emoji: ['🍁', '🍂'][Math.floor(Math.random() * 2)],
      })),
    [],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
      className="pointer-events-none fixed inset-0 z-[35] overflow-hidden"
    >
      {leaves.map((leaf) => (
        <motion.span
          key={leaf.id}
          initial={{ y: '-12vh', x: 0, opacity: 0, rotate: leaf.rotateStart }}
          animate={{
            y: '112vh',
            x: `${leaf.drift}vw`,
            opacity: [0, 1, 1, 0],
            rotate: leaf.rotateEnd,
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
            opacity: {
              times: [0, 0.1, 0.9, 1],
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: 'linear',
            },
          }}
          style={{
            position: 'absolute',
            left: `${leaf.left}%`,
            fontSize: `${leaf.size}px`,
          }}
        >
          {leaf.emoji}
        </motion.span>
      ))}
    </motion.div>
  )
}

export function GlobalFallingLeaves() {
  const { isPlaying } = useMusicPlayer()
  return <AnimatePresence>{isPlaying && <Leaves />}</AnimatePresence>
}
