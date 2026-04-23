import type { Metadata } from 'next'
import { projects } from '@/content/projects'
import { MasonryGrid } from '@/components/works/MasonryGrid'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected product design work by Mohamed Yameen.',
}

export default function WorksIndex() {
  return <MasonryGrid projects={projects} />
}
