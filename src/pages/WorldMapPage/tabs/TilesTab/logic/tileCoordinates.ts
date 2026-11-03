const DEGREES_PER_RADIAN = 180 / Math.PI;

/**
 * Where Web Mercator's square world is cut off, north and south: the latitude whose y is as far from the equator as
 * 180° of longitude is from the prime meridian.
 */
export const MERCATOR_MAX_LATITUDE = Math.atan(Math.sinh(Math.PI)) * DEGREES_PER_RADIAN;

type TileToLonLatProps = {
  /**
   * Column, counted from 180° west. Fractions point inside a tile.
   */
  x: number;
  /**
   * Row, counted from the top. Fractions point inside a tile.
   */
  y: number;
  z: number;
};

export function tileToLonLat(props: TileToLonLatProps): [number, number] {
  const { x, y, z } = props;

  const tilesPerSide = 2 ** z;
  const longitude = (x / tilesPerSide) * 360 - 180;
  const latitude = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / tilesPerSide))) * DEGREES_PER_RADIAN;

  return [longitude, latitude];
}

type LonLatToTileProps = {
  longitude: number;
  /**
   * Between -MERCATOR_MAX_LATITUDE and MERCATOR_MAX_LATITUDE.
   */
  latitude: number;
  z: number;
};

/**
 * The fractional tile position of a point, the inverse of `tileToLonLat`.
 */
export function lonLatToTile(props: LonLatToTileProps) {
  const { longitude, latitude, z } = props;

  const tilesPerSide = 2 ** z;
  const latitudeInRadians = latitude / DEGREES_PER_RADIAN;
  const x = ((longitude + 180) / 360) * tilesPerSide;
  const y = ((1 - Math.log(Math.tan(Math.PI / 4 + latitudeInRadians / 2)) / Math.PI) / 2) * tilesPerSide;

  const tilePosition = { x, y };

  return tilePosition;
}
