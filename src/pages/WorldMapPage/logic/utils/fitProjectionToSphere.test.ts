import { geoEqualEarth, geoMercator, geoOrthographic, geoPath, type GeoSphere } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { fitProjectionToSphere } from './fitProjectionToSphere';

const SPHERE: GeoSphere = { type: 'Sphere' };

describe('fitProjectionToSphere', () => {
  it('should draw the orthographic globe as a circle centered in the box', () => {
    const projection = fitProjectionToSphere({ createProjection: geoOrthographic, width: 960, height: 480 });

    const expectedResult = [
      [240, 0],
      [720, 480],
    ];
    const actualResult = geoPath(projection).bounds(SPHERE);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should cut Mercator off at about 85.05° north, where the map becomes a square', () => {
    const projection = fitProjectionToSphere({ createProjection: geoMercator, width: 960, height: 480 });

    const [, topEdgeLatitude] = projection.invert!([480, 0])!;

    expect(topEdgeLatitude).toBeCloseTo(85.05, 2);
  });

  it('should stretch Equal Earth across the full width of the box', () => {
    const projection = fitProjectionToSphere({ createProjection: geoEqualEarth, width: 960, height: 480 });

    const [[left], [right]] = geoPath(projection).bounds(SPHERE);
    const actualResult = right - left;

    expect(actualResult).toBeCloseTo(960, 6);
  });
});
