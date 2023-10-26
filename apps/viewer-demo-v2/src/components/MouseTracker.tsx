import { MouseTrackerProps, OSDViewerRef } from '@lunit/osd-react-renderer'
import OpenSeadragon from 'openseadragon'
import { RefObject, useCallback, useRef } from 'react'
import { WHEEL_BUTTON } from '../const'

export default function MouseTracker({
  osdViewerRef,
}: {
  osdViewerRef: RefObject<OSDViewerRef>
}) {
  const lastPoint = useRef<OpenSeadragon.Point | null>(null)
  const prevDelta = useRef<OpenSeadragon.Point | null>(null)
  const prevTime = useRef<number>(-1)

  const cancelPanning = useCallback(() => {
    lastPoint.current = null
    prevDelta.current = null
    prevTime.current = -1
  }, [])

  const handleMouseTrackerLeave = useCallback<
    NonNullable<MouseTrackerProps['onLeave']>
  >(() => {
    // temporary fix about malfunction(?) of mouseup and onNonPrimaryRelease event
    cancelPanning?.()
  }, [cancelPanning])

  const handleMouseTrackerNonPrimaryPress = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryPress']>
  >(event => {
    if (event.button === WHEEL_BUTTON) {
      lastPoint.current = event.position?.clone() || null
      prevDelta.current = new OpenSeadragon.Point(0, 0)
      prevTime.current = 0
    }
  }, [])

  const handleMouseTrackerNonPrimaryRelease = useCallback<
    NonNullable<MouseTrackerProps['onNonPrimaryRelease']>
  >(
    event => {
      if (event.button === WHEEL_BUTTON) {
        cancelPanning()
      }
    },
    [cancelPanning]
  )

  const handleMouseTrackerMove = useCallback<
    NonNullable<MouseTrackerProps['onMove']>
  >(
    event => {
      const viewer = osdViewerRef.current?.viewer
      const throttle = 150
      if (viewer && viewer.viewport) {
        if (lastPoint.current && event.position) {
          const deltaPixels = lastPoint.current.minus(event.position)
          const deltaPoints = viewer.viewport.deltaPointsFromPixels(deltaPixels)
          lastPoint.current = event.position.clone()
          if (!throttle || throttle < 0) {
            viewer.viewport.panBy(deltaPoints)
          } else if (prevDelta.current) {
            const newTimeDelta = Date.now() - prevTime.current
            const newDelta = prevDelta.current.plus(deltaPoints)
            if (newTimeDelta > throttle) {
              viewer.viewport.panBy(newDelta)
              prevDelta.current = new OpenSeadragon.Point(0, 0)
              prevTime.current = 0
            } else {
              prevDelta.current = newDelta
              prevTime.current = newTimeDelta
            }
          }
        }
      }
    },
    [osdViewerRef]
  )

  return (
    <mouseTracker
      onLeave={handleMouseTrackerLeave}
      onNonPrimaryPress={handleMouseTrackerNonPrimaryPress}
      onNonPrimaryRelease={handleMouseTrackerNonPrimaryRelease}
      onMove={handleMouseTrackerMove}
    />
  )
}
