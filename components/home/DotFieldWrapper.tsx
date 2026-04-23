'use client'
import dynamic from 'next/dynamic'

const SpaceGame = dynamic(() => import('./SpaceGame'), { ssr: false })

export default function SpaceGameWrapper() {
  return <SpaceGame />
}
