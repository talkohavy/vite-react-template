import { geoBounds, geoDistance, type GeoPermissibleObjects } from 'd3-geo';

export type BoundingCircle = {
  center: [number, number];
  /**
   * In radians.
   */
  radius: number;
};

type GetBoundingCircleProps = { object: GeoPermissibleObjects };

/**
 * A circle on the sphere around the object's longitude/latitude box. Within such a box, the point farthest from its
 * middle is always one of the corners.
 */
export function getBoundingCircle(props: GetBoundingCircleProps): BoundingCircle {
  const { object } = props;

  const [[west, south], [eastBeforeWrap, north]] = geoBounds(object);
  const east = eastBeforeWrap < west ? eastBeforeWrap + 360 : eastBeforeWrap;
  const center: [number, number] = [(west + east) / 2, (south + north) / 2];
  const corners: Array<[number, number]> = [
    [west, south],
    [west, north],
    [east, south],
    [east, north],
  ];
  const radius = Math.max(...corners.map((corner) => geoDistance(center, corner)));

  const boundingCircle = { center, radius };

  return boundingCircle;
}
