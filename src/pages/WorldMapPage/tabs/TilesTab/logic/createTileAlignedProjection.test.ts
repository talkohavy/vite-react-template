import { describe, expect, it } from 'vite-plus/test';
import { createTileAlignedProjection } from './createTileAlignedProjection';

const PARIS: [number, number] = [2.3522, 48.8566];

/**
 * The OpenStreetMap wiki's formula for the tile containing a point.
 */
function getSlippyTile(longitude: number, latitude: number, zoom: number) {
  const latitudeInRadians = (latitude * Math.PI) / 180;
  const tilesPerSide = 2 ** zoom;
  const x = Math.floor(((longitude + 180) / 360) * tilesPerSide);
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latitudeInRadians) + 1 / Math.cos(latitudeInRadians)) / Math.PI) / 2) * tilesPerSide,
  );

  return [x, y];
}

describe('createTileAlignedProjection', () => {
  it('should put the null island at the middle of the world square', () => {
    const expectedResult = [480, 240];

    const projection = createTileAlignedProjection({ transform: { k: 1, x: 0, y: -240 }, baseWorldSize: 960 });
    const actualResult = projection([0, 0]);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should put Paris in the same zoom-10 tile as the slippy map formula', () => {
    const tileZoom = 10;
    const expectedResult = getSlippyTile(...PARIS, tileZoom);

    const projection = createTileAlignedProjection({
      transform: { k: (256 * 2 ** tileZoom) / 960, x: 0, y: 0 },
      baseWorldSize: 960,
    });
    const [x, y] = projection(PARIS)!;
    const actualResult = [Math.floor(x / 256), Math.floor(y / 256)];

    expect(actualResult).toEqual(expectedResult);
    expect(actualResult).toEqual([518, 352]);
  });

  it('should stay exact at street level, where the world is over 100 million units wide', () => {
    const tileZoom = 19;
    const k = (256 * 2 ** tileZoom) / 960;
    const transform = { k, x: -0.5e8, y: -0.4e8 };
    const projection = createTileAlignedProjection({ transform, baseWorldSize: 960 });
    const unzoomedProjection = createTileAlignedProjection({ transform: { k: 1, x: 0, y: 0 }, baseWorldSize: 960 });
    const [unzoomedX, unzoomedY] = unzoomedProjection(PARIS)!;
    const expectedResult = [unzoomedX * k + transform.x, unzoomedY * k + transform.y];

    const actualResult = projection(PARIS)!;

    expect(actualResult[0]).toBeCloseTo(expectedResult[0]!, 3);
    expect(actualResult[1]).toBeCloseTo(expectedResult[1]!, 3);
  });
});
