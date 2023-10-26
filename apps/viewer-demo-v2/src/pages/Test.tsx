import OSDViewer, {
  CanvasOverlayProps,
  OSDViewerRef,
  ScalebarLocation,
} from '@lunit/osd-react-renderer'
import Viewport from '../components/Viewport'
import {
  VIEWER_OPTIONS,
  tiledImageSource,
  MICRONS_PER_METER,
  DEMO_MPP,
} from '../const'
import { useCallback, useRef, useState } from 'react'
import CanvasOverlay from '../components/CanvasOverlay'

let timer: ReturnType<typeof setTimeout>

export default function TestPage() {
  const osdViewerRef = useRef<OSDViewerRef>(null)

  const [rectSize, setRectSize] = useState<[number, number]>([5000, 5000])

  const handleUpdatedCanvasOverlayRedraw = useCallback<
    NonNullable<CanvasOverlayProps['onRedraw']>
  >(
    (canvas: HTMLCanvasElement, viewer: OpenSeadragon.Viewer) => {
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)'
        ctx.fillRect(50, 50, rectSize[0], rectSize[1])
      }
      if (viewer.world && viewer.world.getItemAt(0)) {
        const imgSize = viewer.world.getItemAt(0).getContentSize()
        clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        timer = setTimeout(() => {
          setRectSize([Math.random() * imgSize.x, Math.random() * imgSize.y])
        }, 5000)
      }
    },
    [rectSize]
  )

  return (
    <OSDViewer options={VIEWER_OPTIONS} ref={osdViewerRef}>
      <Viewport osdViewerRef={osdViewerRef} />
      <tiledImage {...tiledImageSource} />
      <scalebar
        pixelsPerMeter={MICRONS_PER_METER / DEMO_MPP}
        xOffset={10}
        yOffset={30}
        barThickness={3}
        color="#443aff"
        fontColor="#53646d"
        backgroundColor={'rgba(255,255,255,0.5)'}
        location={ScalebarLocation.BOTTOM_RIGHT}
      />
      <CanvasOverlay redrawFn={handleUpdatedCanvasOverlayRedraw} />
    </OSDViewer>
  )
}
