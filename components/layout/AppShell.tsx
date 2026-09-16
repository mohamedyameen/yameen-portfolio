'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import PageTransition from '@/components/layout/PageTransition'
import { cn } from '@/lib/utils'

/**
 * Global chrome around the routed page.
 *
 * Work detail pages (`/works/<slug>`) read full-bleed: no sidebar, no left
 * offset, so the case study owns the whole viewport. Its own sticky "Back to
 * work" link is the way out. Every other route keeps the persistent sidebar
 * and the matching content inset.
 *
 * Client-side only because the decision keys off the pathname — the sidebar
 * and the inset have to agree, so they live together here rather than being
 * split between the root layout and a conditional inside Sidebar.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const fullBleed = pathname?.startsWith('/works/') ?? false

  return (
    <>
      {!fullBleed && <Sidebar />}
      <main className={cn('min-h-screen', !fullBleed && 'lg:pl-[28rem]')}>
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  )
}
