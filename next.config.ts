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
