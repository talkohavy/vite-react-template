import { MAX_TILE_ZOOM, TILE_SIZE } from './constants';

type GetTileZoomProps = {
  /**
   * Width of the whole Web Mercator world at the current zoom, in map units.
   */
  worldSize: number;
};

/**
 * The tile level whose tiles come closest to their natural 256 units, so they're drawn between 71% and 141% of it.
 */
export function getTileZoom(props: GetTileZoomProps) {
  const { worldSize } = props;

  const exactZoom = Math.log2(worldSize / TILE_SIZE);
  const tileZoom = Math.min(MAX_TILE_ZOOM, Math.max(0, Math.round(exactZoom)));

  return tileZoom;
}
