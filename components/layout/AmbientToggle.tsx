'use client'
import { PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { useSound } from '@/hooks/useSound'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Play/pause for the drift on the sidebar's ambient background. Sits next to
 * SoundToggle and mirrors its shape so the two media controls read as a pair.
 *
 * Controlled: the paused state lives in Sidebar, which owns both the toggle
 * and the AmbientBackdrop instances it drives.
 */
export default function AmbientToggle({
  paused,
  onToggle,
}: {
  paused: boolean
  onToggle: () => void
}) {
  const { playHover } = useSound()
  const label = paused ? 'Resume background motion' : 'Pause background motion'
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onMouseEnter={playHover}
          onClick={onToggle}
          aria-label={label}
          aria-pressed={paused}
          className="grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
        >
          {paused ? <PlayIcon size={20} /> : <PauseIcon size={20} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}
