'use client'

import React, { useEffect, useState, type ReactNode } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

/**
 * Generic staggered-card carousel. The layout, rotation, clip-path corner,
 * and click-to-shift behavior are preserved from the original reference —
 * only the content is decoupled.
 *
 * Each item is positioned by its offset from the center; index 0 is the
 * focused card. Clicking a card shifts the stack so that card moves to center.
 */

type WithId = { id: string | number }

interface StaggerCardsProps<T extends WithId> {
  items: T[]
  renderItem: (item: T, isCenter: boolean) => ReactNode
  cardSize?: { sm: number; md: number }
  height?: number
  className?: string
}

export function StaggerCards<T extends WithId>({
  items,
  renderItem,
  cardSize = { sm: 290, md: 365 },
  height = 600,
  className,
}: StaggerCardsProps<T>) {
  const [size, setSize] = useState(cardSize.md)
  const [list, setList] = useState<T[]>(items)

  // Keep internal list in sync if the caller's items array changes.
  useEffect(() => {
    setList(items)
  }, [items])

  useEffect(() => {
    const update = () => {
      const matches =
        typeof window !== 'undefined' &&
        window.matchMedia('(min-width: 640px)').matches
      setSize(matches ? cardSize.md : cardSize.sm)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [cardSize.md, cardSize.sm])

  const handleMove = (steps: number) => {
    setList((prev) => {
      const next = [...prev]
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = next.shift()
          if (!item) return prev
          next.push(item)
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = next.pop()
          if (!item) return prev
          next.unshift(item)
        }
      }
      return next
    })
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-muted/30',
        className,
      )}
      style={{ height }}
    >
      {list.map((item, index) => {
        const position =
          list.length % 2
            ? index - (list.length + 1) / 2
            : index - list.length / 2
        return (
          <StaggerCard
            key={String(item.id)}
            position={position}
            cardSize={size}
            onShift={handleMove}
            isCenter={position === 0}
          >
            {renderItem(item, position === 0)}
          </StaggerCard>
        )
      })}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <ShiftButton
          direction="prev"
          onClick={() => handleMove(-1)}
        />
        <ShiftButton
          direction="next"
          onClick={() => handleMove(1)}
        />
      </div>
    </div>
  )
}

interface StaggerCardProps {
  position: number
  cardSize: number
  isCenter: boolean
  onShift: (steps: number) => void
  children: ReactNode
}

function StaggerCard({
  position,
  cardSize,
  isCenter,
  onShift,
  children,
}: StaggerCardProps) {
  return (
    <div
      onClick={() => onShift(position)}
      className={cn(
        'absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out',
        isCenter
          ? 'z-10 border-primary bg-primary text-primary-foreground'
          : 'z-0 border-border bg-card text-card-foreground hover:border-primary/50',
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)',
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? '0px 8px 0px 4px hsl(var(--border))'
          : '0px 0px 0px 0px transparent',
      }}
    >
      {/* Diagonal accent line in the clipped corner */}
      <span
        aria-hidden
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: Math.sqrt(5000),
          height: 2,
        }}
      />
      {children}
    </div>
  )
}

function ShiftButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? CaretLeftIcon : CaretRightIcon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        'flex h-14 w-14 items-center justify-center text-2xl transition-colors',
        'border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <Icon />
    </button>
  )
}
