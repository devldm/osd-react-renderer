import OSDViewer, { OSDViewerRef } from '@lunit/osd-react-renderer'
import { VIEWER_OPTIONS } from '../const'
import { useRef } from 'react'

export default function TestCustom() {
  const osdViewerRef = useRef<OSDViewerRef>(null)

  return (
    <OSDViewer options={VIEWER_OPTIONS} ref={osdViewerRef}>
      <tiledImage
        url="https://pdl1.api.dev.scope.lunit.io/slides/dzi/metadata?file=mrxs_test/SIZE_TEST_2.mrxs"
        tileUrlBase="https://pdl1.api.dev.scope.lunit.io/slides/images/dzi/mrxs_test/SIZE_TEST_2.mrxs"
      />
    </OSDViewer>
  )
}
