import { describe, expect, it } from 'vite-plus/test';
import { getVectorTileLevel } from './getVectorTileLevel';

describe('getVectorTileLevel', () => {
  it('should round the zoom down to a tile level', () => {
    const expectedResult = 9;

    const actualResult = getVectorTileLevel(9.8);

    expect(actualResult).toBe(expectedResult);
  });

  it('should keep using the deepest level once zoomed past it', () => {
    const expectedResult = 14;

    const actualResult = getVectorTileLevel(18.2);

    expect(actualResult).toBe(expectedResult);
  });

  it('should never go below level 0', () => {
    const expectedResult = 0;

    const actualResult = getVectorTileLevel(-0.5);

    expect(actualResult).toBe(expectedResult);
  });
});
