import { describe, expect, it } from 'vite-plus/test';
import { getTileZoom } from './getTileZoom';

describe('getTileZoom', () => {
  it('should use a single tile for a 256-unit world', () => {
    const expectedResult = 0;

    const actualResult = getTileZoom({ worldSize: 256 });

    expect(actualResult).toBe(expectedResult);
  });

  it('should round to the nearest level', () => {
    const expectedResult = [2, 3];

    const actualResult = [getTileZoom({ worldSize: 1400 }), getTileZoom({ worldSize: 1500 })];

    expect(actualResult).toEqual(expectedResult);
  });

  it('should never go below 0', () => {
    const expectedResult = 0;

    const actualResult = getTileZoom({ worldSize: 10 });

    expect(actualResult).toBe(expectedResult);
  });

  it('should stop at the deepest level OpenStreetMap serves', () => {
    const expectedResult = 19;

    const actualResult = getTileZoom({ worldSize: 256 * 2 ** 25 });

    expect(actualResult).toBe(expectedResult);
  });
});
