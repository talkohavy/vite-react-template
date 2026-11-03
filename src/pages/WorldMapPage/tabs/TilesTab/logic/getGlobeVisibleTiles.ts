import { geoDistance } from 'd3-geo';
import { getBoxBoundingCircle } from '../../../logic/globe/getBoundingCircle';
import { lonLatToTile, MERCATOR_MAX_LATITUDE, tileToLonLat } from './tileCoordinates';
import type { TileAddress } from './getVisibleTiles';

const DEGREES_PER_RADIAN = 180 / Math.PI;

export type GlobeTile = TileAddress & { key: string };

function range(first: number, last: number) {
  const numbers = Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);

  return numbers;
}

type GetCapColumnsProps = {
  facingPoint: [number, number];
  capRadius: number;
  tilesPerSide: number;
};

/**
 * The tile columns the cap's longitudes fall in. A cap that reaches a pole covers every longitude.
 */
function getCapColumns(props: GetCapColumnsProps) {
  const { facingPoint, capRadius, tilesPerSide } = props;
  const [longitude, latitude] = facingPoint;

  const capRadiusInDegrees = capRadius * DEGREES_PER_RADIAN;
  const isPoleInCap = Math.abs(latitude) + capRadiusInDegrees >= 90;
  const halfWidthInDegrees = isPoleInCap
    ? 180
    : Math.asin(Math.min(1, Math.sin(capRadius) / Math.cos(latitude / DEGREES_PER_RADIAN))) * DEGREES_PER_RADIAN;

  const firstColumn = Math.floor(((longitude - halfWidthInDegrees + 180) / 360) * tilesPerSide);
  const lastColumn = Math.floor(((longitude + halfWidthInDegrees + 180) / 360) * tilesPerSide);

  if (lastColumn - firstColumn + 1 >= tilesPerSide) return range(0, tilesPerSide - 1);

  const columns = range(firstColumn, lastColumn).map((column) => (column + tilesPerSide) % tilesPerSide);

  return columns;
}

type GetGlobeVisibleTilesProps = {
  facingPoint: [number, number];
  /**
   * How far from the facing point the globe is still on screen, in radians.
   */
  capRadius: number;
  tileZoom: number;
};

/**
 * The tiles of one level that may be on screen: first the rows and columns around the visible cap, then only the
 * tiles whose bounding circle reaches it.
 */
export function getGlobeVisibleTiles(props: GetGlobeVisibleTilesProps): Array<GlobeTile> {
  const { facingPoint, capRadius, tileZoom } = props;
  const [longitude, latitude] = facingPoint;

  const tilesPerSide = 2 ** tileZoom;
  const capRadiusInDegrees = capRadius * DEGREES_PER_RADIAN;
  const northernmostLatitude = Math.min(MERCATOR_MAX_LATITUDE, latitude + capRadiusInDegrees);
  const southernmostLatitude = Math.max(-MERCATOR_MAX_LATITUDE, latitude - capRadiusInDegrees);

  if (northernmostLatitude < southernmostLatitude) return [];

  const firstRow = Math.floor(lonLatToTile({ longitude, latitude: northernmostLatitude, z: tileZoom }).y);
  const lastRow = Math.floor(lonLatToTile({ longitude, latitude: southernmostLatitude, z: tileZoom }).y);
  const rows = range(Math.max(0, firstRow), Math.min(tilesPerSide - 1, lastRow));
  const columns = getCapColumns({ facingPoint, capRadius, tilesPerSide });

  const visibleTiles = rows
    .flatMap((y) => columns.map((x) => ({ z: tileZoom, x, y, key: `${tileZoom}/${x}/${y}` })))
    .filter(({ x, y }) => {
      const [west, north] = tileToLonLat({ x, y, z: tileZoom });
      const [east, south] = tileToLonLat({ x: x + 1, y: y + 1, z: tileZoom });
      const { center, radius } = getBoxBoundingCircle({ west, south, east, north });

      return geoDistance(facingPoint, center) <= capRadius + radius;
    });

  return visibleTiles;
}
