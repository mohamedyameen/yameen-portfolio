'use client'

import type { ImageLoaderProps } from 'next/image'
import { staticImage } from '@/lib/static-image'

/**
 * next/image loader (wired via `images.loaderFile` in next.config.ts).
 * Resolves every `<Image>` to a build-time WebP variant instead of the
 * on-demand `/_next/image` optimizer — see scripts/optimize-images.mjs for why.
 * `quality` is fixed at build time and ignored here.
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  return staticImage(src, width)
}
