import { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom';
import { constrainZoomTransform } from '../utils/constrainZoomTransform';
import type { MapZoomTransform } from '../types';

const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const BUTTON_ZOOM_FACTOR = 1.6;
const MAX_WHEEL_STEP = 0.5;

const IDENTITY_TRANSFORM: MapZoomTransform = { k: 1, x: 0, y: 0 };

/**
 * A plain mouse wheel keeps scrolling the page; Ctrl/⌘ + wheel (and trackpad pinch, which the
 * browser reports as Ctrl + wheel) zooms. Drag, touch and double-click work as usual.
 */
function shouldHandleEvent(event: MouseEvent | WheelEvent | TouchEvent) {
  if (event.type === 'wheel') return event.ctrlKey || event.metaKey;

  const isSecondaryButton = 'button' in event && event.button !== 0;

  return !event.ctrlKey && !isSecondaryButton;
}

/**
 * d3's default wheel delta multiplies Ctrl + wheel by 10 so pinch feels right, which makes a single
 * Ctrl + mouse-wheel notch jump 4x. Capping each step keeps both usable.
 */
function getWheelDelta(event: WheelEvent) {
  const modeFactor = event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002;
  const pinchFactor = event.ctrlKey ? 10 : 1;
  const delta = -event.deltaY * modeFactor * pinchFactor;

  const cappedDelta = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, delta));

  return cappedDelta;
}

export function useMapZoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<HTMLDivElement, unknown>>(null);
  const [transform, setTransform] = useState<MapZoomTransform>(IDENTITY_TRANSFORM);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const zoomBehavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .filter(shouldHandleEvent)
      .wheelDelta(getWheelDelta)
      .constrain((nextTransform, extent) => {
        const constrained = constrainZoomTransform({ transform: nextTransform, extent });

        return zoomIdentity.translate(constrained.x, constrained.y).scale(constrained.k);
      })
      .on('zoom', (event: D3ZoomEvent<HTMLDivElement, unknown>) => {
        const { k, x, y } = event.transform;
        setTransform({ k, x, y });
      });

    const selection = select(container);
    selection.call(zoomBehavior);
    zoomBehaviorRef.current = zoomBehavior;

    return () => {
      selection.on('.zoom', null);
      zoomBehaviorRef.current = null;
    };
  }, []);

  function scaleBy(factor: number) {
    const container = containerRef.current;
    const zoomBehavior = zoomBehaviorRef.current;

    if (!container || !zoomBehavior) return;

    zoomBehavior.scaleBy(select(container), factor);
  }

  function zoomIn() {
    scaleBy(BUTTON_ZOOM_FACTOR);
  }

  function zoomOut() {
    scaleBy(1 / BUTTON_ZOOM_FACTOR);
  }

  function resetZoom() {
    const container = containerRef.current;
    const zoomBehavior = zoomBehaviorRef.current;

    if (!container || !zoomBehavior) return;

    zoomBehavior.transform(select(container), zoomIdentity);
  }

  const isZoomedIn = transform.k > MIN_ZOOM;
  const canZoomIn = transform.k < MAX_ZOOM;

  return { containerRef, transform, zoomIn, zoomOut, resetZoom, isZoomedIn, canZoomIn };
}
