import { describe, expect, it } from 'vite-plus/test';
import { lonLatToTile, MERCATOR_MAX_LATITUDE, tileToLonLat } from './tileCoordinates';

describe('tileToLonLat', () => {
  it('should put the top-left corner of the world at 180°W and the Mercator cut-off', () => {
    const [longitude, latitude] = tileToLonLat({ x: 0, y: 0, z: 0 });

    expect(longitude).toBe(-180);
    expect(latitude).toBeCloseTo(85.0511, 4);
  });

  it('should put the middle of the world at 0°, 0°', () => {
    const expectedResult = [0, 0];

    const actualResult = tileToLonLat({ x: 2, y: 2, z: 2 });

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('lonLatToTile', () => {
  it('should find the Eiffel Tower in tile 17/66371/45091', () => {
    const expectedResult = { x: 66371, y: 45091 };

    const { x, y } = lonLatToTile({ longitude: 2.2945, latitude: 48.8584, z: 17 });
    const actualResult = { x: Math.floor(x), y: Math.floor(y) };

    expect(actualResult).toEqual(expectedResult);
  });

  it('should undo tileToLonLat', () => {
    const [longitude, latitude] = tileToLonLat({ x: 3.25, y: 1.5, z: 3 });

    const actualResult = lonLatToTile({ longitude, latitude, z: 3 });

    expect(actualResult.x).toBeCloseTo(3.25);
    expect(actualResult.y).toBeCloseTo(1.5);
  });

  it('should put the Mercator cut-off on the bottom edge of the world', () => {
    const actualResult = lonLatToTile({ longitude: 0, latitude: -MERCATOR_MAX_LATITUDE, z: 4 });

    expect(actualResult.y).toBeCloseTo(16);
  });
});
