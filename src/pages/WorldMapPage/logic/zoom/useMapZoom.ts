import { useEffect, useRef, useState } from 'react';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom';
import type { ZoomTransform } from './types';

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 1024;

const BUTTON_ZOOM_FACTOR = 2;
const MAX_WHEEL_STEP = 0.5;

/**
 * A plain mouse wheel keeps scrolling the page; Ctrl/⌘ + wheel (and trackpad pinch, which the browser reports as
 * Ctrl + wheel) zooms. Dragging and touch work as usual.
 */
function shouldHandleEvent(event: MouseEvent | WheelEvent | TouchEvent, isPanEnabled: boolean) {
  if (event.type === 'wheel') return event.ctrlKey || event.metaKey;

  const isSecondaryButton = 'button' in event && event.button !== 0;

  return isPanEnabled && !event.ctrlKey && !isSecondaryButton;
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

function toD3Transform(transform: ZoomTransform) {
  const d3Transform = zoomIdentity.translate(transform.x, transform.y).scale(transform.k);

  return d3Transform;
}

type UseMapZoomProps = {
  width: number;
  height: number;
  /**
   * Height of the map at 1x when it's taller than the view, like the square Web Mercator world. It starts centered.
   */
  contentHeight?: number;
  maxZoom?: number;
  /**
   * When off, dragging is left to the caller (to spin a globe, say), and only Ctrl/⌘ + wheel and the buttons zoom.
   */
  isPanEnabled?: boolean;
};

export function useMapZoom(props: UseMapZoomProps) {
  const { width, height, contentHeight = height, maxZoom = MAX_ZOOM, isPanEnabled = true } = props;

  const initialTransform: ZoomTransform = { k: 1, x: 0, y: (height - contentHeight) / 2 };

  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>(null);
  const isPanEnabledRef = useRef(isPanEnabled);
  const [transform, setTransform] = useState<ZoomTransform>(initialTransform);

  useEffect(() => {
    isPanEnabledRef.current = isPanEnabled;
  }, [isPanEnabled]);

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .translateExtent([
        [0, 0],
        [width, contentHeight],
      ])
      .scaleExtent([MIN_ZOOM, maxZoom])
      .filter((event: MouseEvent | WheelEvent | TouchEvent) => shouldHandleEvent(event, isPanEnabledRef.current))
      .wheelDelta(getWheelDelta)
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { k, x, y } = event.transform;
        setTransform({ k, x, y });
      });

    const selection = select(svg);
    // Clicks select countries, so a double-click shouldn't also zoom.
    selection.call(zoomBehavior).on('dblclick.zoom', null);
    zoomBehavior.transform(selection, zoomIdentity.translate(0, (height - contentHeight) / 2));
    zoomBehaviorRef.current = zoomBehavior;

    return () => {
      selection.on('.zoom', null);
      zoomBehaviorRef.current = null;
    };
  }, [width, height, contentHeight, maxZoom]);

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

  function zoomTo(targetTransform: ZoomTransform) {
    const svg = svgRef.current;
    const zoomBehavior = zoomBehaviorRef.current;

    if (!svg || !zoomBehavior) return;

    zoomBehavior.transform(select(svg), toD3Transform(targetTransform));
  }

  function resetZoom() {
    zoomTo(initialTransform);
  }

  return { svgRef, transform, zoomIn, zoomOut, resetZoom, zoomTo };
}
