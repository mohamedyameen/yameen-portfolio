import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every <Image> resolves to a WebP rendered at build time by
    // scripts/optimize-images.mjs and served as an immutable static file
    // (see headers() below) — no on-demand /_next/image transforms, which on
    // Vercel cost 400–1800 ms per cold variant and were never browser-cached.
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    // srcset candidates. Must be a subset of IMAGE_WIDTHS in lib/static-image.ts
    // so every candidate maps to a rendered file.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [256, 384, 480],
  },
  async headers() {
    return [
      {
        // Build-time image variants live under a content-hash folder, so
        // they can be cached forever; a changed image gets a new folder.
        source: '/_opt/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // The Facilio Helpdesk demo console lives in public/helpdesk as a static
      // SPA (Vite build + demo-mock.js answering its own /api calls). Its
      // router uses real paths (/helpdesk/tickets, /helpdesk/dispatch/…), so
      // any path under /helpdesk that isn't a real file falls back to its
      // index.html. `fallback` runs only after public files and app routes
      // have been checked, so assets still serve directly.
      fallback: [
        { source: '/helpdesk/:path*', destination: '/helpdesk/index.html' },
        // The same bundle serves the Dispatcher Agent as its own product: the
        // console's product.ts reads the first URL segment, so /dispatcher-agent
        // boots the same index.html with the dispatcher's nav and app id.
        { source: '/dispatcher-agent/:path*', destination: '/helpdesk/index.html' },
      ],
    }
  },
};

export default nextConfig;
