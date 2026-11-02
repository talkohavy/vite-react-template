import type { ZoomTransform } from './types';

type IsBoundsInViewProps = {
  /**
   * `[[left, top], [right, bottom]]` in un-zoomed map units, as returned by `geoPath().bounds()`.
   */
  bounds: [[number, number], [number, number]];
  transform: ZoomTransform;
  width: number;
  height: number;
};

/**
 * Whether any part of `bounds` lands inside the `width` x `height` view once `transform` is applied.
 */
export function isBoundsInView(props: IsBoundsInViewProps) {
  const { bounds, transform, width, height } = props;
  const [[left, top], [right, bottom]] = bounds;
  const { k, x, y } = transform;

  const viewLeft = -x / k;
  const viewTop = -y / k;
  const viewRight = (width - x) / k;
  const viewBottom = (height - y) / k;

  const isInView = right >= viewLeft && left <= viewRight && bottom >= viewTop && top <= viewBottom;

  return isInView;
}
