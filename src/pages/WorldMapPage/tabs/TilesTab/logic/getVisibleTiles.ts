import { getTileZoom } from './getTileZoom';
import type { ZoomTransform } from '../../../logic/zoom/types';

export type TileAddress = { z: number; x: number; y: number };

export type PlacedTile = TileAddress & {
  key: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

function range(first: number, last: number) {
  const numbers = Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);

  return numbers;
}

type PlaceTileProps = {
  tile: TileAddress;
  transform: ZoomTransform;
  /**
   * Width of the Web Mercator world at 1x, in map units.
   */
  baseWorldSize: number;
};

/**
 * Edges are rounded so neighbouring tiles share an edge exactly, with no hairline gap between them.
 */
export function placeTile(props: PlaceTileProps): PlacedTile {
  const { tile, transform, baseWorldSize } = props;
  const { z, x, y } = tile;
  const { k, x: originX, y: originY } = transform;

  const tileSize = (baseWorldSize * k) / 2 ** z;
  const left = Math.round(originX + x * tileSize);
  const top = Math.round(originY + y * tileSize);
  const right = Math.round(originX + (x + 1) * tileSize);
  const bottom = Math.round(originY + (y + 1) * tileSize);

  const placedTile = { z, x, y, key: `${z}/${x}/${y}`, left, top, width: right - left, height: bottom - top };

  return placedTile;
}

type GetVisibleTilesProps = {
  transform: ZoomTransform;
  baseWorldSize: number;
  width: number;
  height: number;
};

export function getVisibleTiles(props: GetVisibleTilesProps) {
  const { transform, baseWorldSize, width, height } = props;
  const { k, x: originX, y: originY } = transform;

  const worldSize = baseWorldSize * k;
  const tileZoom = getTileZoom({ worldSize });
  const tilesPerSide = 2 ** tileZoom;
  const tileSize = worldSize / tilesPerSide;

  const columns = range(
    Math.max(0, Math.floor(-originX / tileSize)),
    Math.min(tilesPerSide - 1, Math.ceil((width - originX) / tileSize) - 1),
  );
  const rows = range(
    Math.max(0, Math.floor(-originY / tileSize)),
    Math.min(tilesPerSide - 1, Math.ceil((height - originY) / tileSize) - 1),
  );

  const tiles = rows.flatMap((y) =>
    columns.map((x) => placeTile({ tile: { z: tileZoom, x, y }, transform, baseWorldSize })),
  );

  return { tileZoom, tiles };
}
