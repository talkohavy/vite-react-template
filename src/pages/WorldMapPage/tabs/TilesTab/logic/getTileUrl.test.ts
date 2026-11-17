import { describe, expect, it } from 'vite-plus/test';
import { getTileUrl } from './getTileUrl';

describe('getTileUrl', () => {
  it('should fill in the z/x/y of the @2x tile URL', () => {
    const expectedResult = 'https://tiles.stadiamaps.com/tiles/osm_bright/10/518/352@2x.png';

    const actualResult = getTileUrl({ z: 10, x: 518, y: 352 });

    expect(actualResult).toBe(expectedResult);
  });
});
