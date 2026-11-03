import { geoDistance } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { WORLD_COUNTRIES } from '../data/worldCountries';
import { getBoundingCircle } from './getBoundingCircle';
import { getFacingGeometry } from './getFacingGeometry';

const DEGREES = Math.PI / 180;
const PARIS: [number, number] = [2.35, 48.86];

function findCountry(name: string) {
  const country = WORLD_COUNTRIES.find((feature) => feature.properties.name === name)!;

  return country;
}

describe('getBoundingCircle', () => {
  it('should contain every position of every country', () => {
    const expectedResult: Array<string> = [];

    const actualResult = WORLD_COUNTRIES.filter((country) => {
      const { center, radius } = getBoundingCircle({ object: country });
      const { geometry } = country;
      const rings = geometry.type === 'Polygon' ? geometry.coordinates : geometry.coordinates.flat();
      const positions = rings.flat() as Array<[number, number]>;

      return positions.some((position) => geoDistance(center, position) > radius + 1e-9);
    }).map((country) => country.properties.name);

    expect(actualResult).toEqual(expectedResult);
  });
});

describe('getFacingGeometry', () => {
  it('should keep the country under the facing point', () => {
    const actualResult = getFacingGeometry({ country: findCountry('France'), facingPoint: PARIS, capRadius: DEGREES });

    expect(actualResult).not.toBeNull();
  });

  it('should drop countries on the far side of a zoomed-in globe', () => {
    const expectedResult: Array<string> = [];
    const farCountries = ['Australia', 'Japan', 'Brazil', 'United States of America'];

    const actualResult = farCountries.filter((name) =>
      getFacingGeometry({ country: findCountry(name), facingPoint: PARIS, capRadius: 5 * DEGREES }),
    );

    expect(actualResult).toEqual(expectedResult);
  });

  it('should drop the far-away polygons of a country that is partly in view', () => {
    const france = findCountry('France');
    const allPolygonCount = france.geometry.coordinates.length;

    const actualResult = getFacingGeometry({ country: france, facingPoint: PARIS, capRadius: DEGREES })!;

    expect(actualResult.coordinates.length).toBeLessThan(allPolygonCount);
  });

  it('should keep a country that crosses the antimeridian when facing its far end', () => {
    const actualResult = getFacingGeometry({
      country: findCountry('Russia'),
      facingPoint: [175, 66],
      capRadius: DEGREES,
    });

    expect(actualResult).not.toBeNull();
  });
});
