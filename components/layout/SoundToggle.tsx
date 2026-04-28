'use client'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '@/hooks/useSound'

export default function SoundToggle() {
  const { enabled, toggle } = useSound()
  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Mute UI sounds' : 'Unmute UI sounds'}
      className="inline-flex items-center justify-center leading-none text-muted-foreground hover:text-foreground transition-colors"
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  )
}
