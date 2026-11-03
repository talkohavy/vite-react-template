import { geoBounds, geoDistance, type GeoPermissibleObjects } from 'd3-geo';

export type BoundingCircle = {
  center: [number, number];
  /**
   * In radians.
   */
  radius: number;
};

type GetBoxBoundingCircleProps = {
  west: number;
  south: number;
  /**
   * May be less than `west` when the box crosses the antimeridian.
   */
  east: number;
  north: number;
};

/**
 * A circle on the sphere around a longitude/latitude box. Within such a box, the point farthest from its middle is
 * always one of the corners.
 */
export function getBoxBoundingCircle(props: GetBoxBoundingCircleProps): BoundingCircle {
  const { west, south, east: eastBeforeWrap, north } = props;

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

type GetBoundingCircleProps = { object: GeoPermissibleObjects };

/**
 * A circle on the sphere around the object's longitude/latitude box.
 */
export function getBoundingCircle(props: GetBoundingCircleProps) {
  const { object } = props;

  const [[west, south], [east, north]] = geoBounds(object);
  const boundingCircle = getBoxBoundingCircle({ west, south, east, north });

  return boundingCircle;
}
