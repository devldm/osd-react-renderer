import { useRef } from 'react'

export default function CanvasOverlay({
  redrawFn,
}: {
  redrawFn: (overlayCanvasEl: HTMLCanvasElement, viewer: any) => void
}) {
  const canvasOverlayRef = useRef(null)

  return <canvasOverlay ref={canvasOverlayRef} onRedraw={redrawFn} />
}
