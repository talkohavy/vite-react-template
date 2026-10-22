import { describe, expect, it } from 'vite-plus/test';
import { buildCityFeatures } from './buildCityFeatures';

describe('buildCityFeatures', () => {
  it('should convert a city into a GeoJSON Point feature', () => {
    const expectedResult = [
      {
        type: 'Feature',
        properties: { name: 'Tokyo', country: 'Japan', continent: 'Asia', population: 37.2 },
        geometry: { type: 'Point', coordinates: [139.69, 35.69] },
      },
    ];
    const actualResult = buildCityFeatures({
      cities: [{ name: 'Tokyo', country: 'Japan', continent: 'Asia', population: 37.2, coordinates: [139.69, 35.69] }],
    });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should return an empty array when there are no cities', () => {
    const expectedResult: Array<unknown> = [];
    const actualResult = buildCityFeatures({ cities: [] });

    expect(actualResult).toEqual(expectedResult);
  });
});
