import OSDViewer, {
  CanvasOverlayProps,
  OSDViewerRef,
  ScalebarLocation,
  TooltipOverlayProps,
} from '@lunit/osd-react-renderer'
import MouseTracker from '../components/MouseTracker'
import ZoomController, { ZoomControllerProps } from '../ZoomController'
import CanvasOverlay from '../components/CanvasOverlay'
import {
  VIEWER_OPTIONS,
  tiledImageSource,
  MICRONS_PER_METER,
  DEMO_MPP,
  DEFAULT_CONTROLLER_MAX_ZOOM,
  DEFAULT_CONTROLLER_MIN_ZOOM,
  RADIUS_UM,
} from '../const'
import { useCallback, useRef } from 'react'
import Viewport from '../components/Viewport'
import OpenSeadragon from 'openseadragon'
import { useAtom } from 'jotai'
import { scaleFactorAtom, viewportZoomAtom } from '../App'

const onTooltipOverlayRedraw: NonNullable<TooltipOverlayProps['onRedraw']> = ({
  tooltipCoord,
  overlayCanvasEl,
  viewer,
}) => {
  const ctx = overlayCanvasEl.getContext('2d')
  if (ctx && tooltipCoord) {
    const radiusPx = RADIUS_UM / DEMO_MPP
    const sizeRect = new OpenSeadragon.Rect(0, 0, 2, 2)
    const lineWidth = viewer.viewport.viewportToImageRectangle(
      viewer.viewport.viewerElementToViewportRectangle(sizeRect)
    ).width
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(tooltipCoord.x, tooltipCoord.y, radiusPx, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
  }
}

export default function Home() {
  const osdViewerRef = useRef<OSDViewerRef>(null)

  const [scaleFactor] = useAtom(scaleFactorAtom)
  const [viewportZoom, setViewportZoom] = useAtom(viewportZoomAtom)

  const handleControllerZoom = useCallback<
    NonNullable<ZoomControllerProps['onZoom']>
  >(
    zoom => {
      setViewportZoom(zoom * scaleFactor)
    },
    [scaleFactor, setViewportZoom]
  )

  const onCanvasOverlayRedraw: NonNullable<CanvasOverlayProps['onRedraw']> = (
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#000'
      ctx.fillRect(50, 50, 5000, 5000)
    }
  }

  return (
    <>
      <OSDViewer
        options={VIEWER_OPTIONS}
        ref={osdViewerRef}
        style={{ width: '100%', height: '100%' }}
      >
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
        s
        <CanvasOverlay redrawFn={onCanvasOverlayRedraw} />
        <tooltipOverlay onRedraw={onTooltipOverlayRedraw} />
        <MouseTracker osdViewerRef={osdViewerRef} />
      </OSDViewer>
      <ZoomController
        zoom={viewportZoom / scaleFactor}
        maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM}
        minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM}
        onZoom={handleControllerZoom}
      />
    </>
  )
}
