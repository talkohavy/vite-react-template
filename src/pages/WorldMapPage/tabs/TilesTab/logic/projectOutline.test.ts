import { geoIdentity, geoPath } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { createTileAlignedProjection } from './createTileAlignedProjection';
import { projectOutline } from './projectOutline';
import type { CountryFeature } from '../../../logic/data/worldCountries';

const PROJECTION = createTileAlignedProjection({ transform: { k: 1, x: 0, y: 0 }, baseWorldSize: 960 });

function createCountry(ring: Array<GeoJSON.Position>): CountryFeature {
  const country: CountryFeature = {
    type: 'Feature',
    properties: { name: 'Testland' },
    geometry: { type: 'Polygon', coordinates: [ring] },
  };

  return country;
}

const SQUARE = createCountry([
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
  [0, 0],
]);

const ACROSS_THE_ANTIMERIDIAN = createCountry([
  [175, -15],
  [-175, -15],
  [-175, -20],
  [175, -20],
  [175, -15],
]);

describe('projectOutline', () => {
  it('should turn a ring into a single line', () => {
    const expectedResult = 1;

    const { outline } = projectOutline({ country: SQUARE, projection: PROJECTION });
    const actualResult = outline.coordinates.length;

    expect(actualResult).toBe(expectedResult);
  });

  it('should measure the bounds of the projected border', () => {
    const { bounds } = projectOutline({ country: SQUARE, projection: PROJECTION });
    const [[left, top], [right, bottom]] = bounds;

    expect(left).toBeCloseTo(480);
    expect(right).toBeCloseTo(480 + 960 / 36);
    expect(bottom).toBeCloseTo(480);
    expect(top).toBeLessThan(bottom);
  });

  it('should cut a border at the antimeridian instead of drawing it across the world', () => {
    const { outline, bounds } = projectOutline({ country: ACROSS_THE_ANTIMERIDIAN, projection: PROJECTION });
    const [[left], [right]] = bounds;

    expect(outline.coordinates.length).toBeGreaterThan(1);
    expect(outline.coordinates.flat().every(([x]) => x! < 30 || x! > 930)).toBe(true);
    expect(right - left).toBeCloseTo(960);
  });

  it('should draw nothing when the view is entirely inside the country', () => {
    const { outline } = projectOutline({ country: SQUARE, projection: PROJECTION });
    const zoomedIntoTheMiddle = geoIdentity()
      .scale(1000)
      .translate([-(480 + 13) * 1000, -(480 - 13) * 1000])
      .clipExtent([
        [0, 0],
        [960, 480],
      ]);

    const actualResult = geoPath(zoomedIntoTheMiddle)(outline);

    expect(actualResult).toBeNull();
  });
});
