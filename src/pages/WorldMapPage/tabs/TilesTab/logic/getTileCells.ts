import { getLonLatTrig, type GlobePoint, type LonLatTrig } from './createGlobePointProjector';
import { tileToLonLat } from './tileCoordinates';
import type { TileAddress } from './getVisibleTiles';

/**
 * A tile is cut into at most this many cells per side. Finer cells would only matter right at the globe's edge,
 * where they're squeezed to a fraction of a unit anyway.
 */
export const MAX_CELLS_PER_SIDE = 16;

/**
 * How far, in map units, a cell's corners and middle may be from where the projection really puts them.
 */
export const MAX_CELL_ERROR = 0.75;

/**
 * A square part of a tile, in sixteenths of the tile, drawn as the parallelogram from `origin` spanned by `across` and
 * `down`.
 */
export type TileCell = {
  column: number;
  row: number;
  size: number;
  originX: number;
  originY: number;
  acrossX: number;
  acrossY: number;
  downX: number;
  downY: number;
};

type GetTileCellsProps = {
  tile: TileAddress;
  projectPoint: (lonLatTrig: LonLatTrig) => GlobePoint;
};

/**
 * Splits the tile into four, again and again, until each part is close enough to a parallelogram (the only shape a
 * canvas can stretch an image into) or the smallest cell size is reached. Parts on the far side are dropped.
 */
export function getTileCells(props: GetTileCellsProps): Array<TileCell> {
  const { tile, projectPoint } = props;
  const { z, x, y } = tile;

  const gridLines = Array.from({ length: MAX_CELLS_PER_SIDE + 1 }, (_, index) => index / MAX_CELLS_PER_SIDE);
  const columnTrigs = gridLines.map((fraction) => getLonLatTrig(tileToLonLat({ x: x + fraction, y, z })));
  const rowTrigs = gridLines.map((fraction) => getLonLatTrig(tileToLonLat({ x, y: y + fraction, z })));
  const grid = rowTrigs.map(({ cosLatitude, sinLatitude }) =>
    columnTrigs.map(({ cosLongitude, sinLongitude }) =>
      projectPoint({ cosLongitude, sinLongitude, cosLatitude, sinLatitude }),
    ),
  );

  const cells: Array<TileCell> = [];

  function visit(column: number, row: number, size: number) {
    const topLeft = grid[row]![column]!;
    const topRight = grid[row]![column + size]!;
    const bottomLeft = grid[row + size]![column]!;
    const bottomRight = grid[row + size]![column + size]!;
    const corners = [topLeft, topRight, bottomLeft, bottomRight];

    if (corners.every(({ isFacing }) => !isFacing)) return;

    const acrossX = (topRight.x - topLeft.x + bottomRight.x - bottomLeft.x) / 2;
    const acrossY = (topRight.y - topLeft.y + bottomRight.y - bottomLeft.y) / 2;
    const downX = (bottomLeft.x - topLeft.x + bottomRight.x - topRight.x) / 2;
    const downY = (bottomLeft.y - topLeft.y + bottomRight.y - topRight.y) / 2;
    const originX = (topLeft.x + topRight.x + bottomLeft.x + bottomRight.x) / 4 - (acrossX + downX) / 2;
    const originY = (topLeft.y + topRight.y + bottomLeft.y + bottomRight.y) / 4 - (acrossY + downY) / 2;

    const checkPoints: Array<[number, number, GlobePoint]> = [
      [0, 0, topLeft],
      [1, 0, topRight],
      [0, 1, bottomLeft],
      [1, 1, bottomRight],
    ];
    if (size > 1) checkPoints.push([0.5, 0.5, grid[row + size / 2]![column + size / 2]!]);
    const error = Math.max(
      ...checkPoints.map(([across, down, point]) =>
        Math.hypot(
          originX + across * acrossX + down * downX - point.x,
          originY + across * acrossY + down * downY - point.y,
        ),
      ),
    );

    const isAllFacing = corners.every(({ isFacing }) => isFacing);

    if ((!isAllFacing || error > MAX_CELL_ERROR) && size > 1) {
      const halfSize = size / 2;
      visit(column, row, halfSize);
      visit(column + halfSize, row, halfSize);
      visit(column, row + halfSize, halfSize);
      visit(column + halfSize, row + halfSize, halfSize);

      return;
    }

    if (isAllFacing) cells.push({ column, row, size, originX, originY, acrossX, acrossY, downX, downY });
  }

  visit(0, 0, MAX_CELLS_PER_SIDE);

  return cells;
}
