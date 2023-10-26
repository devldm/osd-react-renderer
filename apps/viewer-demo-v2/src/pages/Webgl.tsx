import OSDViewer, {
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
import useWebGL from '../hooks/useWebGL'
import { useRef } from 'react'

export default function WebglPage() {
  const osdViewerRef = useRef<OSDViewerRef>(null)

  const { onWebGLOverlayRedraw } = useWebGL()
  const webGLOverlayRef = useRef(null)

  return (
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
      <webGLOverlay ref={webGLOverlayRef} onRedraw={onWebGLOverlayRedraw} />
    </OSDViewer>
  )
}
