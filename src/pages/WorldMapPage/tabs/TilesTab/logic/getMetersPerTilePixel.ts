import { EARTH_CIRCUMFERENCE_METERS, TILE_SIZE } from './constants';

type GetMetersPerTilePixelProps = {
  latitude: number;
  tileZoom: number;
};

/**
 * Web Mercator stretches east-west distances by 1 / cos(latitude), so a pixel covers less ground away from the equator.
 */
export function getMetersPerTilePixel(props: GetMetersPerTilePixelProps) {
  const { latitude, tileZoom } = props;

  const latitudeInRadians = (latitude * Math.PI) / 180;
  const metersPerPixel = (EARTH_CIRCUMFERENCE_METERS * Math.cos(latitudeInRadians)) / (TILE_SIZE * 2 ** tileZoom);

  return metersPerPixel;
}
