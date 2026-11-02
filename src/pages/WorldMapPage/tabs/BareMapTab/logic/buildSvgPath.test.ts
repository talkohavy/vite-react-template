import { describe, expect, it } from 'vite-plus/test';
import { buildSvgPath } from './buildSvgPath';

describe('buildSvgPath', () => {
  it('should stretch a horizontal line across the full width, centered vertically', () => {
    const geoObject: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: [
        [-10, 0],
        [10, 0],
      ],
    };

    const expectedResult = 'M0,50L100,50';
    const actualResult = buildSvgPath({ geoObject, width: 100, height: 100 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should flip latitude so north points up the screen', () => {
    const geoObject: GeoJSON.LineString = {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [10, 10],
      ],
    };

    const expectedResult = 'M0,100L100,0';
    const actualResult = buildSvgPath({ geoObject, width: 100, height: 100 });

    expect(actualResult).toEqual(expectedResult);
  });
});
