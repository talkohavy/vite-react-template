import { TILE_SIZE } from './constants';
import { createTileAlignedProjection } from './createTileAlignedProjection';
import type { ZoomTransform } from '../../../logic/zoom/types';

type GetTransformCenteredOnProps = {
  longitude: number;
  latitude: number;
  tileZoom: number;
  baseWorldSize: number;
  width: number;
  height: number;
};

/**
 * The zoom that puts a place in the middle of the view, with tiles of `tileZoom` drawn at their natural size.
 */
export function getTransformCenteredOn(props: GetTransformCenteredOnProps): ZoomTransform {
  const { longitude, latitude, tileZoom, baseWorldSize, width, height } = props;

  const k = (TILE_SIZE * 2 ** tileZoom) / baseWorldSize;
  const baseProjection = createTileAlignedProjection({ transform: { k: 1, x: 0, y: 0 }, baseWorldSize });
  const [baseX, baseY] = baseProjection([longitude, latitude])!;

  const transform = { k, x: width / 2 - k * baseX, y: height / 2 - k * baseY };

  return transform;
}
