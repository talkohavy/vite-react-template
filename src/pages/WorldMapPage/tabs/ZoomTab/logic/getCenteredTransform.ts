import type { ZoomTransform } from '../../../logic/zoom/types';

type GetCenteredTransformProps = {
  zoomLevel: number;
  width: number;
  height: number;
};

/**
 * Scales around the middle of the view, so a spun globe keeps the point facing the viewer in the middle.
 */
export function getCenteredTransform(props: GetCenteredTransformProps): ZoomTransform {
  const { zoomLevel, width, height } = props;

  const transform = { k: zoomLevel, x: (width * (1 - zoomLevel)) / 2, y: (height * (1 - zoomLevel)) / 2 };

  return transform;
}
