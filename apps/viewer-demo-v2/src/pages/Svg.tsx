import OSDViewer, {
  OSDViewerRef,
  ScalebarLocation,
} from '@lunit/osd-react-renderer'
import MouseTracker from '../components/MouseTracker'
import Viewport from '../components/Viewport'
import {
  VIEWER_OPTIONS,
  tiledImageSource,
  MICRONS_PER_METER,
  DEMO_MPP,
} from '../const'
import useSVG from '../hooks/useSVG'
import { useRef } from 'react'

export default function SvgPage() {
  const osdViewerRef = useRef<OSDViewerRef>(null)

  const { setSVGSubVisibility, setSVGAllVisible } = useSVG()

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'max-content',
        }}
      >
        <button onClick={setSVGAllVisible}>svg visible</button>
        <button onClick={() => setSVGSubVisibility(0)}>svg sub 1</button>
        <button onClick={() => setSVGSubVisibility(1)}>svg sub 2</button>
        <button onClick={() => setSVGSubVisibility(2)}>svg sub 3</button>
      </div>
      <OSDViewer
        options={VIEWER_OPTIONS}
        ref={osdViewerRef}
        style={{ width: '100%', height: '100%' }}
      >
        <Viewport osdViewerRef={osdViewerRef} />

        <tiledImage {...tiledImageSource} />
        <svgOverlay />
        <MouseTracker osdViewerRef={osdViewerRef} />
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
      </OSDViewer>
    </>
  )
}
