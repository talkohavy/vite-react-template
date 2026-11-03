import { GLOBE_RADIUS, TILE_SIZE } from './constants';
import { getTileZoom } from './getTileZoom';
import { MERCATOR_MAX_LATITUDE } from './tileCoordinates';

const RADIANS_PER_DEGREE = Math.PI / 180;

/**
 * Below this, tiles are so big that even their smallest cells bend too much to pass for flat.
 */
export const MIN_GLOBE_TILE_ZOOM = 3;

function getCosLatitude(latitude: number) {
  const clampedLatitude = Math.max(-MERCATOR_MAX_LATITUDE, Math.min(MERCATOR_MAX_LATITUDE, latitude));
  const cosLatitude = Math.cos(clampedLatitude * RADIANS_PER_DEGREE);

  return cosLatitude;
}

type GetGlobeTileZoomProps = {
  /**
   * The globe's radius on screen, in map units.
   */
  radiusOnScreen: number;
  /**
   * The latitude facing the viewer, where tiles should be drawn at about their natural size.
   */
  latitude: number;
};

/**
 * Web Mercator stretches the world by 1 / cos(latitude), so tiles near the poles cover less ground and look smaller
 * on a globe. Measuring the world at the facing latitude keeps the tiles in the middle of the view at about 256 units.
 */
export function getGlobeTileZoom(props: GetGlobeTileZoomProps) {
  const { radiusOnScreen, latitude } = props;

  const worldSizeAtLatitude = 2 * Math.PI * radiusOnScreen * getCosLatitude(latitude);
  const tileZoom = Math.max(MIN_GLOBE_TILE_ZOOM, getTileZoom({ worldSize: worldSizeAtLatitude }));

  return tileZoom;
}

type GetGlobeZoomForTileZoomProps = {
  tileZoom: number;
  latitude: number;
};

/**
 * The inverse of `getGlobeTileZoom`: the zoom at which the tile level is drawn at exactly its natural size.
 */
export function getGlobeZoomForTileZoom(props: GetGlobeZoomForTileZoomProps) {
  const { tileZoom, latitude } = props;

  const zoomLevel = (2 ** tileZoom * TILE_SIZE) / (2 * Math.PI * GLOBE_RADIUS * getCosLatitude(latitude));

  return zoomLevel;
}
