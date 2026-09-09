import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller), WebP as the fallback; served per the browser's Accept header.
    formats: ['image/avif', 'image/webp'],
    // Everything under public/ is versioned in git, so hold optimized variants
    // for a week instead of the 4h default. Rename a file (or wait a week) when
    // you replace an image with the same filename.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
