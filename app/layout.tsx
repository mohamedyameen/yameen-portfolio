import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { LayoutGroup } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import PageTransition from '@/components/layout/PageTransition'
import SmoothScroll from '@/components/layout/SmoothScroll'
import ScrollbarOverlay from '@/components/layout/ScrollbarOverlay'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MusicPlayerProvider } from '@/components/music/MusicPlayerProvider'
import { GlobalFallingLeaves } from '@/components/music/FallingLeaves'
import {
  siteUrl,
  siteName,
  siteAuthor,
  siteTitle,
  siteDescription,
  siteTwitter,
} from '@/lib/site'
import './globals.css'

const geistSans = localFont({
  src: '../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2',
  variable: '--font-geist-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s · Yameen',
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteAuthor, url: siteUrl }],
  creator: siteAuthor,
  keywords: [
    'Yameen',
    'Mohamed Yameen',
    'Product Designer',
    'Lead Product Designer',
    'UX Designer',
    'UI Designer',
    'AI Product Design',
    'B2B SaaS Design',
    'Design Systems',
    'Facilio',
    'Portfolio',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    creator: siteTwitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'design',
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${playfair.variable}`}>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="yameen-theme" disableTransitionOnChange>
          <TooltipProvider delayDuration={150}>
            <MusicPlayerProvider>
              <GlobalFallingLeaves />
              <LayoutGroup>
                <SmoothScroll />
                <ScrollbarOverlay />
                <Sidebar />
                <main className="min-h-screen pt-[72px] md:pt-14 lg:pt-0 lg:pl-[26rem]">
                  <PageTransition>{children}</PageTransition>
                </main>
              </LayoutGroup>
            </MusicPlayerProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
