import { describe, expect, it } from 'vite-plus/test';
import { getTileUrl } from './getTileUrl';

describe('getTileUrl', () => {
  it('should fill in the z/x/y of the OpenStreetMap tile URL', () => {
    const expectedResult = 'https://tile.openstreetmap.org/10/518/352.png';

    const actualResult = getTileUrl({ z: 10, x: 518, y: 352 });

    expect(actualResult).toBe(expectedResult);
  });
});
