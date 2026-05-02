'use client'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '@/hooks/useSound'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function SoundToggle() {
  const { enabled, toggle } = useSound()
  const label = enabled ? 'Mute UI sounds' : 'Unmute UI sounds'
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggle}
          aria-label={label}
          className="inline-flex items-center justify-center leading-none text-muted-foreground hover:text-foreground transition-colors"
        >
          {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}
