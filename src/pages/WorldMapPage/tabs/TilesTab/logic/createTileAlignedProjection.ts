import { geoMercator } from 'd3-geo';
import type { ZoomTransform } from '../../../logic/zoom/types';

type CreateTileAlignedProjectionProps = {
  transform: ZoomTransform;
  baseWorldSize: number;
};

/**
 * Web Mercator with the zoom baked in: the world is a square of `baseWorldSize * k` units whose top-left corner sits
 * at the zoom's translation, exactly where the tile grid puts it.
 */
export function createTileAlignedProjection(props: CreateTileAlignedProjectionProps) {
  const { transform, baseWorldSize } = props;
  const { k, x, y } = transform;

  const worldSize = baseWorldSize * k;
  const projection = geoMercator()
    .scale(worldSize / (2 * Math.PI))
    .translate([x + worldSize / 2, y + worldSize / 2]);

  return projection;
}
