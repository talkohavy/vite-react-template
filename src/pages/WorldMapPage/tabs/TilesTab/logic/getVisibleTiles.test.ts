import { describe, expect, it } from 'vite-plus/test';
import { getVisibleTiles } from './getVisibleTiles';

const VIEW = { baseWorldSize: 960, width: 960, height: 480 };

describe('getVisibleTiles', () => {
  it('should show the middle 2 rows of the 4x4 zoom-2 grid when the world is centered at 1x', () => {
    const expectedResult = ['2/0/1', '2/1/1', '2/2/1', '2/3/1', '2/0/2', '2/1/2', '2/2/2', '2/3/2'];

    const { tiles } = getVisibleTiles({ ...VIEW, transform: { k: 1, x: 0, y: -240 } });
    const actualResult = tiles.map(({ key }) => key);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should place each tile at its spot in the world square', () => {
    const expectedResult = { left: 240, top: 0, width: 240, height: 240 };

    const { tiles } = getVisibleTiles({ ...VIEW, transform: { k: 1, x: 0, y: -240 } });
    const actualResult = tiles.find(({ key }) => key === '2/1/1');

    expect(actualResult).toMatchObject(expectedResult);
  });

  it('should not ask for tiles beyond the edge of the world', () => {
    const expectedResult = [0, 1, 2, 3];

    const { tiles } = getVisibleTiles({ ...VIEW, transform: { k: 1, x: -100, y: -240 } });
    const actualResult = [...new Set(tiles.map(({ x }) => x))];

    expect(actualResult).toEqual(expectedResult);
  });

  it('should only ask for the tiles in view when zoomed in', () => {
    const expectedResult = { tileZoom: 10, tileCount: 15 };

    const { tileZoom, tiles } = getVisibleTiles({ ...VIEW, transform: { k: 1024 * (256 / 960), x: -1000, y: -1000 } });
    const actualResult = { tileZoom, tileCount: tiles.length };

    expect(actualResult).toEqual(expectedResult);
  });

  it('should make neighbouring tiles share an edge when tiles have a fractional size', () => {
    const { tiles } = getVisibleTiles({ ...VIEW, transform: { k: 1.01, x: 0, y: -240 } });
    const firstRow = tiles.filter(({ y }) => y === 1);

    const actualResult = firstRow
      .slice(1)
      .map((tile, index) => tile.left - (firstRow[index]!.left + firstRow[index]!.width));

    expect(actualResult).toEqual([0, 0, 0]);
  });
});
