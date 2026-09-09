'use client'
import { SpeakerHighIcon, SpeakerSlashIcon } from '@phosphor-icons/react'
import { useSound } from '@/hooks/useSound'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function SoundToggle() {
  const { enabled, toggle, playHover } = useSound()
  const label = enabled ? 'Mute UI sounds' : 'Unmute UI sounds'
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onMouseEnter={playHover}
          onClick={toggle}
          aria-label={label}
          className="grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
        >
          {enabled ? <SpeakerHighIcon size={20} /> : <SpeakerSlashIcon size={20} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}
