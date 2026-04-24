'use client'
import { Marquee } from '@/components/ui/marquee'

const brands = ['Mellow', 'Blue Whistle', 'Facilio', 'Blubees', 'Ordereye']

export function BrandMarquee() {
  return (
    <div className="border-b border-border py-4">
      <Marquee
        className="[--duration:16s] [--gap:2rem] text-xl md:text-2xl font-medium tracking-tight"
        repeat={3}
      >
        {brands.map((brand) => (
          <span key={brand} className="flex items-center gap-8">
            {brand === 'Facilio' ? (
              <span className="relative inline-block">
                <span className="relative text-foreground">{brand}</span>
                <span
                  className="absolute -bottom-2.5 left-[65%] flex items-end gap-1 text-[11px] italic font-semibold text-foreground whitespace-nowrap leading-none tracking-wide"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  <svg
                    width="14"
                    height="11"
                    viewBox="0 0 20 16"
                    fill="none"
                    className="shrink-0 mb-0.5"
                    aria-hidden
                  >
                    <path
                      d="M17 14 C 4 14, 3 10, 3 3"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1 5 L3 2 L5 5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  currently here
                </span>
              </span>
            ) : (
              <span className="text-foreground/40">{brand}</span>
            )}
            <span className="text-foreground/25">·</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
