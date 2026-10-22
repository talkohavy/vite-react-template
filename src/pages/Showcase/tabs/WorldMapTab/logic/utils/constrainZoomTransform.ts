import type { MapZoomTransform } from '../types';

type ConstrainZoomTransformProps = {
  transform: MapZoomTransform;
  /**
   * The viewport box, `[[x0, y0], [x1, y1]]`, that the zoomed content must keep covering.
   */
  extent: [[number, number], [number, number]];
};

/**
 * Clamps the translation so the zoomed content never leaves a gap inside the viewport.
 * Assumes `k >= 1`, i.e. the content is at least as large as the viewport.
 */
export function constrainZoomTransform(props: ConstrainZoomTransformProps): MapZoomTransform {
  const { transform, extent } = props;
  const { k, x, y } = transform;
  const [[x0, y0], [x1, y1]] = extent;

  const clampedX = Math.min(x0 - x0 * k, Math.max(x1 - x1 * k, x));
  const clampedY = Math.min(y0 - y0 * k, Math.max(y1 - y1 * k, y));

  return { k, x: clampedX, y: clampedY };
}
