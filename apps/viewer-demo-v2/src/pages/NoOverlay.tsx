import OSDViewer, { OSDViewerRef } from '@lunit/osd-react-renderer'
import { VIEWER_OPTIONS, tiledImageSource } from '../const'
import { useRef } from 'react'

export default function NoOverlay() {
  const osdViewerRef = useRef<OSDViewerRef>(null)

  return (
    <OSDViewer options={VIEWER_OPTIONS} ref={osdViewerRef}>
      <tiledImage {...tiledImageSource} />
    </OSDViewer>
  )
}
