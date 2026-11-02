import { geoArea } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { rewindInvertedPolygons } from './rewindInvertedPolygons';
import type { CountryFeature } from '../data/worldCountries';

const CLOCKWISE_TRIANGLE: Array<GeoJSON.Position> = [
  [-80.19, 25.76],
  [-64.78, 32.29],
  [-66.11, 18.47],
  [-80.19, 25.76],
];

const COUNTERCLOCKWISE_TRIANGLE = CLOCKWISE_TRIANGLE.toReversed();

const HEMISPHERE_AREA = 2 * Math.PI;

describe('rewindInvertedPolygons', () => {
  it('should leave a correctly wound polygon untouched', () => {
    const feature: CountryFeature = {
      type: 'Feature',
      properties: { name: 'Fine' },
      geometry: { type: 'Polygon', coordinates: [CLOCKWISE_TRIANGLE] },
    };

    const expectedResult = feature;
    const actualResult = rewindInvertedPolygons({ feature });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should reverse a polygon that covers more than a hemisphere', () => {
    const feature: CountryFeature = {
      type: 'Feature',
      properties: { name: 'Inverted' },
      geometry: { type: 'Polygon', coordinates: [COUNTERCLOCKWISE_TRIANGLE] },
    };

    const rewoundFeature = rewindInvertedPolygons({ feature });

    expect(geoArea(rewoundFeature)).toBeLessThan(HEMISPHERE_AREA);
  });

  it('should only reverse the inverted parts of a MultiPolygon', () => {
    const feature: CountryFeature = {
      type: 'Feature',
      properties: { name: 'Mixed' },
      geometry: { type: 'MultiPolygon', coordinates: [[CLOCKWISE_TRIANGLE], [COUNTERCLOCKWISE_TRIANGLE]] },
    };

    const expectedResult = [[CLOCKWISE_TRIANGLE], [CLOCKWISE_TRIANGLE]];
    const actualResult = (rewindInvertedPolygons({ feature }).geometry as GeoJSON.MultiPolygon).coordinates;

    expect(actualResult).toEqual(expectedResult);
  });
});
