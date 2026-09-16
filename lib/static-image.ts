import { imageVersion, imageWidths } from '@/lib/image-manifest'

/** Widths rendered by scripts/optimize-images.mjs. Keep the two lists in sync. */
export const IMAGE_WIDTHS = [256, 384, 480, 640, 828, 1080, 1440, 1920] as const

/**
 * URL of the pre-rendered WebP variant of a `public/` image that is at least
 * `width` pixels wide (capped at the source's own width). Falls back to the
 * original file for anything the build pipeline didn't render (SVGs, images
 * not referenced as string literals), so nothing ever 404s.
 *
 * Variants are static files under `/_opt/<version>/…` with a one-year
 * immutable cache, so they need no runtime transform and browsers keep them.
 */
export function staticImage(src: string, width: number): string {
  const max = imageWidths[src]
  if (!max) return src
  const target = Math.min(width, max)
  const w = IMAGE_WIDTHS.find((c) => c >= target && c < max) ?? max
  const base = src.replace(/\.[^./]+$/, '')
  return `/_opt/${imageVersion}${base}-${w}.webp`
}
