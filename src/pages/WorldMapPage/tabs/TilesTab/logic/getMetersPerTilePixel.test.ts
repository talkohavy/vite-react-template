import { describe, expect, it } from 'vite-plus/test';
import { getMetersPerTilePixel } from './getMetersPerTilePixel';

describe('getMetersPerTilePixel', () => {
  it('should spread the equator over the 256 pixels of the single zoom-0 tile', () => {
    const expectedResult = 156543.03;

    const actualResult = getMetersPerTilePixel({ latitude: 0, tileZoom: 0 });

    expect(actualResult).toBeCloseTo(expectedResult, 2);
  });

  it('should cover about 30 cm per pixel at the equator at zoom 19', () => {
    const expectedResult = 0.2986;

    const actualResult = getMetersPerTilePixel({ latitude: 0, tileZoom: 19 });

    expect(actualResult).toBeCloseTo(expectedResult, 4);
  });

  it('should halve at 60 degrees, where Mercator stretches distances twofold', () => {
    const equator = getMetersPerTilePixel({ latitude: 0, tileZoom: 10 });
    const expectedResult = equator / 2;

    const actualResult = getMetersPerTilePixel({ latitude: 60, tileZoom: 10 });

    expect(actualResult).toBeCloseTo(expectedResult, 6);
  });
});
