import Image from 'next/image'
import type { Block } from '@/content/projects'
import { cn } from '@/lib/utils'

const aspectClass: Record<NonNullable<Extract<Block, { type: 'image' }>['aspect']>, string> = {
  '16/9': 'aspect-[16/9]',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
  '9/16': 'aspect-[9/16]',
  '21/9': 'aspect-[21/9]',
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="text-base md:text-lg font-semibold text-foreground mt-4">
          {block.content}
        </h2>
      )

    case 'text':
      return (
        <p className="text-sm md:text-base text-foreground/75 leading-relaxed max-w-[65ch]">
          {block.content}
        </p>
      )

    case 'image':
      return (
        <figure className="flex flex-col gap-2">
          <div className={cn(
            'relative w-full overflow-hidden rounded-md bg-secondary/40 border border-border',
            block.aspect ? aspectClass[block.aspect] : 'aspect-[16/9]'
          )}>
            <Image
              src={block.src}
              alt={block.alt ?? ''}
              fill
              sizes="(max-width: 768px) 100vw, 960px"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'video':
      return (
        <figure className="flex flex-col gap-2">
          <video
            src={block.src}
            poster={block.poster}
            autoPlay={block.autoplay ?? true}
            loop={block.loop ?? true}
            muted={block.muted ?? true}
            playsInline
            controls={!block.autoplay}
            className="w-full rounded-md border border-border bg-secondary/40"
          />
          {block.caption && (
            <figcaption className="text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
  }
}
