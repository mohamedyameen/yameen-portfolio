/**
 * Lock page scroll for a modal/overlay and compensate for the scrollbar width
 * so nothing shifts sideways when it appears/disappears.
 *
 * The site forces a 4px custom scrollbar (see globals.css). Hiding it — via
 * `overflow: hidden` and Lenis's `.lenis-stopped` — widens the viewport, and a
 * `position: fixed` overlay centered in that viewport visibly jumps to the side.
 * Because the lock and unlock happen in lockstep with this helper, we expose the
 * measured width as `--sb` and let overlays add it back to their right padding
 * (`pr-[calc(...+var(--sb,0px))]`). Both toggle at the same instant, so the
 * centered sheet stays put through the open and close animations.
 *
 * Returns a cleanup function that fully restores the previous state.
 */
export function lockScroll(): () => void {
  const sbw = window.innerWidth - document.documentElement.clientWidth
  const root = document.documentElement
  const prevOverflow = document.body.style.overflow
  const prevPadding = document.body.style.paddingRight

  root.style.setProperty('--sb', `${sbw}px`)
  document.body.style.overflow = 'hidden'
  // Fill the vacated scrollbar space so the page content behind the overlay
  // doesn't reflow sideways — that reflow is visible through the translucent
  // backdrop as the whole page drifting while the sheet animates.
  document.body.style.paddingRight = `${sbw}px`
  globalThis.lenis?.stop()

  return () => {
    document.body.style.overflow = prevOverflow
    document.body.style.paddingRight = prevPadding
    root.style.removeProperty('--sb')
    globalThis.lenis?.start()
  }
}
