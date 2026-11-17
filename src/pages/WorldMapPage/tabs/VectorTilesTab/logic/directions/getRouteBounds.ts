import type { LngLat } from './constants';

/**
 * The south-west and north-east corners around every point given.
 */
export function getRouteBounds(points: Array<LngLat>): [LngLat, LngLat] {
  const longitudes = points.map(([longitude]) => longitude);
  const latitudes = points.map(([, latitude]) => latitude);

  const southWest: LngLat = [Math.min(...longitudes), Math.min(...latitudes)];
  const northEast: LngLat = [Math.max(...longitudes), Math.max(...latitudes)];

  return [southWest, northEast];
}
