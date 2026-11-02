import { describe, expect, it } from 'vite-plus/test';
import { describeCountryValue } from './describeCountryValue';
import type { CountryFeature } from '../../../logic/data/worldCountries';

const COUNTRY: CountryFeature = {
  type: 'Feature',
  id: '999',
  properties: { name: 'Testland' },
  geometry: { type: 'Polygon', coordinates: [] },
};

const ROW = { isoCode: '999', name: 'Republic of Testland', population: 1000, year: 2019, areaKm2: 50 };

describe('describeCountryValue', () => {
  it('should name the joined row and its value', () => {
    const expectedResult = 'row 999 (Republic of Testland) · 1,000 people';

    const actualResult = describeCountryValue({ country: COUNTRY, row: ROW, metric: 'population' });

    expect(actualResult).toBe(expectedResult);
  });

  it('should explain that a country without an ISO code has no data', () => {
    const countryWithoutCode = { ...COUNTRY, id: undefined };
    const expectedResult = 'no data: no ISO code to join on';

    const actualResult = describeCountryValue({ country: countryWithoutCode, row: null, metric: 'population' });

    expect(actualResult).toBe(expectedResult);
  });

  it('should name the code when no row matches it', () => {
    const expectedResult = 'no data: no row for code 999';

    const actualResult = describeCountryValue({ country: COUNTRY, row: null, metric: 'population' });

    expect(actualResult).toBe(expectedResult);
  });

  it('should explain that a density needs an area', () => {
    const rowWithoutArea = { ...ROW, areaKm2: 0 };
    const expectedResult = 'row 999 (Republic of Testland) · no data: its outline has no area';

    const actualResult = describeCountryValue({ country: COUNTRY, row: rowWithoutArea, metric: 'density' });

    expect(actualResult).toBe(expectedResult);
  });
});
