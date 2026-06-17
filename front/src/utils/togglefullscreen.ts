export const toggleFullscreen = async (el: HTMLElement | null) => {
  if (!el) return

  if (!document.fullscreenElement) {
    await el.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}
