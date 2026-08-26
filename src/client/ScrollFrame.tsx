/**
 * An always-visible custom scrollbar around one native overflow viewport.
 * macOS may hide native overlay scrollbars regardless of `::-webkit-scrollbar`
 * styling, so long lists use this deterministic rail while preserving native
 * wheel, trackpad, touch, and programmatic scrolling.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react'

interface PersistentScrollFrameProps {
  children: ReactNode
  viewportClassName: string
  label: string
}

interface ScrollMetrics {
  scrollable: boolean
  thumbTop: number
  thumbHeight: number
}

const IDLE_METRICS: ScrollMetrics = { scrollable: false, thumbTop: 0, thumbHeight: 0 }

export function PersistentScrollFrame({ children, viewportClassName, label }: PersistentScrollFrameProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ y: number; scrollTop: number } | null>(null)
  const [metrics, setMetrics] = useState<ScrollMetrics>(IDLE_METRICS)

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    if (viewport === null) return
    const { clientHeight, scrollHeight, scrollTop } = viewport
    const scrollable = scrollHeight > clientHeight + 1
    if (!scrollable || clientHeight <= 0) {
      setMetrics((previous) => (previous.scrollable ? IDLE_METRICS : previous))
      return
    }
    const thumbHeight = Math.max(28, (clientHeight / scrollHeight) * clientHeight)
    const thumbTravel = clientHeight - thumbHeight
    const scrollTravel = scrollHeight - clientHeight
    const thumbTop = scrollTravel > 0 ? (scrollTop / scrollTravel) * thumbTravel : 0
    setMetrics((previous) =>
      previous.scrollable === scrollable &&
      Math.abs(previous.thumbTop - thumbTop) < 0.5 &&
      Math.abs(previous.thumbHeight - thumbHeight) < 0.5
        ? previous
        : { scrollable, thumbTop, thumbHeight },
    )
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (viewport === null) return
    const content = viewport.firstElementChild
    const onScroll = (): void => measure()
    viewport.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(viewport)
    if (content instanceof Element) observer?.observe(content)
    measure()
    return () => {
      viewport.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      observer?.disconnect()
    }
  }, [measure])

  const scrollFromTrack = (clientY: number, rail: HTMLDivElement): void => {
    const viewport = viewportRef.current
    if (viewport === null || !metrics.scrollable) return
    const rect = rail.getBoundingClientRect()
    const thumbTravel = viewport.clientHeight - metrics.thumbHeight
    const scrollTravel = viewport.scrollHeight - viewport.clientHeight
    const desiredTop = Math.max(0, Math.min(thumbTravel, clientY - rect.top - metrics.thumbHeight / 2))
    viewport.scrollTop = thumbTravel > 0 ? (desiredTop / thumbTravel) * scrollTravel : 0
  }

  const onThumbKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const viewport = viewportRef.current
    if (viewport === null || !metrics.scrollable) return
    const line = 40
    const page = Math.max(80, viewport.clientHeight * 0.8)
    const next =
      event.key === 'ArrowDown'
        ? viewport.scrollTop + line
        : event.key === 'ArrowUp'
          ? viewport.scrollTop - line
          : event.key === 'PageDown'
            ? viewport.scrollTop + page
            : event.key === 'PageUp'
              ? viewport.scrollTop - page
              : event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? viewport.scrollHeight
                  : null
    if (next === null) return
    event.preventDefault()
    viewport.scrollTop = next
  }

  return (
    <div className="dsh_mr_scrollFrame" data-scrollable={metrics.scrollable}>
      <div ref={viewportRef} className={viewportClassName}>
        {children}
      </div>
      {metrics.scrollable && (
        <div
          className="dsh_mr_scrollRail"
          onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) scrollFromTrack(event.clientY, event.currentTarget)
          }}
        >
          <div
            className="dsh_mr_scrollThumb"
            role="scrollbar"
            aria-label={label}
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={Math.max(0, (viewportRef.current?.scrollHeight ?? 0) - (viewportRef.current?.clientHeight ?? 0))}
            aria-valuenow={Math.round(viewportRef.current?.scrollTop ?? 0)}
            tabIndex={0}
            style={{ top: metrics.thumbTop, height: metrics.thumbHeight }}
            onKeyDown={onThumbKeyDown}
            onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
              const viewport = viewportRef.current
              if (viewport === null) return
              dragRef.current = { y: event.clientY, scrollTop: viewport.scrollTop }
              event.currentTarget.setPointerCapture(event.pointerId)
              event.preventDefault()
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              const viewport = viewportRef.current
              const drag = dragRef.current
              if (viewport === null || drag === null) return
              const thumbTravel = viewport.clientHeight - metrics.thumbHeight
              const scrollTravel = viewport.scrollHeight - viewport.clientHeight
              viewport.scrollTop = drag.scrollTop + (event.clientY - drag.y) * (scrollTravel / Math.max(1, thumbTravel))
            }}
            onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
              dragRef.current = null
              event.currentTarget.releasePointerCapture(event.pointerId)
            }}
            onPointerCancel={() => {
              dragRef.current = null
            }}
          />
        </div>
      )}
    </div>
  )
}
