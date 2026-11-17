import { MAX_VECTOR_TILE_LEVEL } from './constants';

/**
 * The level of the vector tiles MapLibre draws at a zoom: the zoom rounded down, until the tiles run out.
 */
export function getVectorTileLevel(zoom: number) {
  const tileLevel = Math.min(MAX_VECTOR_TILE_LEVEL, Math.max(0, Math.floor(zoom)));

  return tileLevel;
}
