import { geoOrthographic } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { createGlobePointProjector } from './createGlobePointProjector';
import { getGlobeVisibleTiles } from './getGlobeVisibleTiles';
import { getTileCells, MAX_CELLS_PER_SIDE } from './getTileCells';
import { tileToLonLat } from './tileCoordinates';
import type { GlobeRotation } from '../../../logic/globe/getRotationAfterDrag';

const ROTATION: GlobeRotation = [-10, -50];
const FACING_POINT: [number, number] = [10, 50];
const RADIUS = 240;
const CENTER: [number, number] = [480, 240];

const projection = geoOrthographic().rotate(ROTATION).scale(RADIUS).translate(CENTER);
const projectPoint = createGlobePointProjector({ rotation: ROTATION, radius: RADIUS, center: CENTER });
const tiles = getGlobeVisibleTiles({ facingPoint: FACING_POINT, capRadius: Math.PI / 2, tileZoom: 3 });
const cellsByTile = tiles.map((tile) => ({ tile, cells: getTileCells({ tile, projectPoint }) }));

describe('getTileCells', () => {
  it('should cover the whole tile when it faces the viewer', () => {
    const expectedResult = MAX_CELLS_PER_SIDE ** 2;

    const { cells } = cellsByTile.find(({ tile }) => tile.key === '3/4/2')!;
    const actualResult = cells.reduce((coveredArea, { size }) => coveredArea + size ** 2, 0);

    expect(actualResult).toBe(expectedResult);
  });

  it('should keep every part of every cell within a unit of the real projection', () => {
    const samples = [0, 0.25, 0.5, 0.75, 1];

    const actualResult = Math.max(
      ...cellsByTile.flatMap(({ tile, cells }) =>
        cells.flatMap(({ column, row, size, originX, originY, acrossX, acrossY, downX, downY }) =>
          samples.flatMap((down) =>
            samples.map((across) => {
              const lonLat = tileToLonLat({
                x: tile.x + (column + across * size) / MAX_CELLS_PER_SIDE,
                y: tile.y + (row + down * size) / MAX_CELLS_PER_SIDE,
                z: tile.z,
              });
              const [expectedX, expectedY] = projection(lonLat)!;

              return Math.hypot(
                originX + across * acrossX + down * downX - expectedX,
                originY + across * acrossY + down * downY - expectedY,
              );
            }),
          ),
        ),
      ),
    );

    expect(actualResult).toBeLessThan(1);
  });

  it('should drop tiles on the far side of the globe', () => {
    const expectedResult = [0, 0, 0, 0];
    const tilesEastOf135SouthOfTheEquator = [4, 5, 6, 7].map((y) => ({ z: 3, x: 7, y }));

    const actualResult = tilesEastOf135SouthOfTheEquator.map((tile) => getTileCells({ tile, projectPoint }).length);

    expect(actualResult).toEqual(expectedResult);
  });
});
