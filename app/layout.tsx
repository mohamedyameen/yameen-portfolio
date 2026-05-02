import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Playfair_Display, Caveat } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { LayoutGroup } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import PageTransition from '@/components/layout/PageTransition'
import SmoothScroll from '@/components/layout/SmoothScroll'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MusicPlayerProvider } from '@/components/music/MusicPlayerProvider'
import { FloatingMusicPlayer } from '@/components/music/MusicPlayer'
import { GlobalFallingLeaves } from '@/components/music/FallingLeaves'
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

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-caveat',
})

export const metadata: Metadata = {
  title: {
    default: 'Yameen · Lead Product Designer',
    template: '%s · Yameen',
  },
  description:
    'Lead Product Designer crafting AI-native products, B2B SaaS, and design systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${playfair.variable} ${caveat.variable}`}>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="yameen-theme">
          <TooltipProvider delayDuration={150}>
            <MusicPlayerProvider>
              <GlobalFallingLeaves />
              <LayoutGroup>
                <SmoothScroll />
                <Sidebar />
                <main className="min-h-screen pt-[72px] md:pt-14 lg:pt-0 lg:pl-72">
                  <PageTransition>{children}</PageTransition>
                </main>
                <FloatingMusicPlayer />
              </LayoutGroup>
            </MusicPlayerProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
