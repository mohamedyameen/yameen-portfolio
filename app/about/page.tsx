import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'Info',
  description:
    'Mohamed Yameen — Lead Product Designer. A little about me, what I do, and what keeps me going outside of work.',
}

export default function AboutPage() {
  return <AboutContent />
}
