import { describe, expect, it } from 'vite-plus/test';
import { summarizeCountryFeature } from './summarizeCountryFeature';
import type { CountryFeature } from '../../../logic/data/worldCountries';

const SQUARE_RING: Array<GeoJSON.Position> = [
  [0, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
];

describe('summarizeCountryFeature', () => {
  it('should count the rings and positions of a Polygon', () => {
    const feature: CountryFeature = {
      type: 'Feature',
      id: '001',
      properties: { name: 'Squareland' },
      geometry: { type: 'Polygon', coordinates: [SQUARE_RING] },
    };

    const expectedResult = [
      '{',
      '  type: "Feature",',
      '  id: "001",',
      '  properties: { name: "Squareland" },',
      '  geometry: {',
      '    type: "Polygon",',
      '    coordinates: [ 1 ring, 5 positions ]',
      '  }',
      '}',
    ].join('\n');
    const actualResult = summarizeCountryFeature({ feature });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should count the polygons and positions of a MultiPolygon', () => {
    const feature: CountryFeature = {
      type: 'Feature',
      id: '002',
      properties: { name: 'Twin Islands' },
      geometry: { type: 'MultiPolygon', coordinates: [[SQUARE_RING], [SQUARE_RING]] },
    };

    const actualResult = summarizeCountryFeature({ feature });

    expect(actualResult).toContain('coordinates: [ 2 polygons, 10 positions ]');
  });

  it('should show a missing id as undefined', () => {
    const feature: CountryFeature = {
      type: 'Feature',
      properties: { name: 'Nowhere' },
      geometry: { type: 'Polygon', coordinates: [SQUARE_RING] },
    };

    const actualResult = summarizeCountryFeature({ feature });

    expect(actualResult).toContain('id: undefined,');
  });
});
