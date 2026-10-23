import type { MapZoomTransform } from '../types';
import type { GeoProjection } from 'd3-geo';

/**
 * Applies a screen-space zoom transform (scale `k`, then translate `x`,`y`) to a projection,
 * so a projected point `p` lands at `k * p + [x, y]`.
 */
export function applyZoomToProjection(props: {
  projection: GeoProjection;
  transform: MapZoomTransform;
}): GeoProjection {
  const { projection, transform } = props;
  const { k, x, y } = transform;

  const [translateX, translateY] = projection.translate();

  projection.scale(projection.scale() * k).translate([translateX * k + x, translateY * k + y]);

  return projection;
}
