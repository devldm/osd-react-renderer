import { ViewportProps } from 'packages/renderer/src/types'
import { RefObject, useCallback, useState } from 'react'
import { OSDViewerRef } from '@lunit/osd-react-renderer'
import {
  DEMO_MPP,
  DEFAULT_CONTROLLER_MAX_ZOOM,
  DEFAULT_CONTROLLER_MIN_ZOOM,
} from '../const'
import { scaleFactorAtom, viewportZoomAtom } from '../App'
import { useAtom } from 'jotai'

export default function Viewport({
  osdViewerRef,
}: {
  osdViewerRef: RefObject<OSDViewerRef>
}) {
  const [rotation, setRotation] = useState<number>(0)
  const [refPoint, setRefPoint] = useState<OpenSeadragon.Point>()
  const [scaleFactor, setScaleFactor] = useAtom(scaleFactorAtom)
  const [viewportZoom, setViewportZoom] = useAtom(viewportZoomAtom)

  const handleViewportZoom = useCallback<NonNullable<ViewportProps['onZoom']>>(
    ({ eventSource: viewer, zoom, refPoint }) => {
      if (viewer == null || zoom == null) {
        return
      }
      setViewportZoom(zoom)
      setRefPoint(refPoint || undefined)
    },
    [setViewportZoom]
  )

  const refreshScaleFactor = useCallback(() => {
    const viewer = osdViewerRef.current?.viewer
    if (!viewer || !viewer.world.getItemAt(0)) {
      return
    }
    const imageWidth = viewer.world.getItemAt(0).getContentSize().x
    const microscopeWidth1x = ((imageWidth * DEMO_MPP) / 25400) * 96 * 10
    const viewportWidth = viewer.viewport.getContainerSize().x
    setScaleFactor(microscopeWidth1x / viewportWidth)
  }, [osdViewerRef, setScaleFactor])

  const handleViewportOpen = useCallback<
    NonNullable<ViewportProps['onOpen']>
  >(() => {
    refreshScaleFactor()
  }, [refreshScaleFactor])

  const handleViewportResize = useCallback<
    NonNullable<ViewportProps['onResize']>
  >(() => {
    refreshScaleFactor()
  }, [refreshScaleFactor])

  const handleViewportRotate = useCallback<
    NonNullable<ViewportProps['onRotate']>
  >(
    ({ eventSource: viewer, degrees }) => {
      if (viewer == null || degrees == null) {
        return
      }
      refreshScaleFactor()
      setRotation(degrees)
    },
    [refreshScaleFactor]
  )

  return (
    <>
      <viewport
        zoom={viewportZoom}
        refPoint={refPoint}
        rotation={rotation}
        onOpen={handleViewportOpen}
        onResize={handleViewportResize}
        onRotate={handleViewportRotate}
        onZoom={handleViewportZoom}
        maxZoomLevel={DEFAULT_CONTROLLER_MAX_ZOOM * scaleFactor}
        minZoomLevel={DEFAULT_CONTROLLER_MIN_ZOOM * scaleFactor}
      />
    </>
  )
}
