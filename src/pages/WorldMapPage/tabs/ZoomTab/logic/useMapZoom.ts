import { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom';
import type { ZoomTransform } from './types';

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 1024;

const BUTTON_ZOOM_FACTOR = 2;
const MAX_WHEEL_STEP = 0.5;

const IDENTITY_TRANSFORM: ZoomTransform = { k: 1, x: 0, y: 0 };

/**
 * A plain mouse wheel keeps scrolling the page; Ctrl/⌘ + wheel (and trackpad pinch, which the browser reports as
 * Ctrl + wheel) zooms. Dragging and touch work as usual.
 */
function shouldHandleEvent(event: MouseEvent | WheelEvent | TouchEvent) {
  if (event.type === 'wheel') return event.ctrlKey || event.metaKey;

  const isSecondaryButton = 'button' in event && event.button !== 0;

  return !event.ctrlKey && !isSecondaryButton;
}

/**
 * d3 multiplies Ctrl + wheel deltas by 10 so pinching feels right, which makes a single Ctrl + mouse-wheel notch jump
 * 4x. Capping each step keeps both usable.
 */
function getWheelDelta(event: WheelEvent) {
  const modeFactor = event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002;
  const pinchFactor = event.ctrlKey ? 10 : 1;
  const delta = -event.deltaY * modeFactor * pinchFactor;

  const cappedDelta = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, delta));

  return cappedDelta;
}

type UseMapZoomProps = {
  width: number;
  height: number;
};

export function useMapZoom(props: UseMapZoomProps) {
  const { width, height } = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>(null);
  const [transform, setTransform] = useState<ZoomTransform>(IDENTITY_TRANSFORM);

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    const extent: [[number, number], [number, number]] = [
      [0, 0],
      [width, height],
    ];

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .extent(extent)
      .translateExtent(extent)
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .filter(shouldHandleEvent)
      .wheelDelta(getWheelDelta)
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { k, x, y } = event.transform;
        setTransform({ k, x, y });
      });

    const selection = select(svg);
    // Clicks select countries, so a double-click shouldn't also zoom.
    selection.call(zoomBehavior).on('dblclick.zoom', null);
    zoomBehaviorRef.current = zoomBehavior;

    return () => {
      selection.on('.zoom', null);
      zoomBehaviorRef.current = null;
    };
  }, [width, height]);

  function scaleBy(factor: number) {
    const svg = svgRef.current;
    const zoomBehavior = zoomBehaviorRef.current;

    if (!svg || !zoomBehavior) return;

    zoomBehavior.scaleBy(select(svg), factor);
  }

  function zoomIn() {
    scaleBy(BUTTON_ZOOM_FACTOR);
  }

  function zoomOut() {
    scaleBy(1 / BUTTON_ZOOM_FACTOR);
  }

  function resetZoom() {
    const svg = svgRef.current;
    const zoomBehavior = zoomBehaviorRef.current;

    if (!svg || !zoomBehavior) return;

    zoomBehavior.transform(select(svg), zoomIdentity);
  }

  return { svgRef, transform, zoomIn, zoomOut, resetZoom };
}
