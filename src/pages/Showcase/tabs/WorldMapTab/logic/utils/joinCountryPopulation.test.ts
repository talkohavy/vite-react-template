import { describe, expect, it } from 'vite-plus/test';
import { joinCountryPopulation } from './joinCountryPopulation';
import type { CountryFeature } from '../types';

function createCountry(props: { id?: string; name: string }): CountryFeature {
  const { id, name } = props;

  const country: CountryFeature = {
    type: 'Feature',
    id,
    properties: { name },
    geometry: { type: 'Point', coordinates: [0, 0] },
  };

  return country;
}

describe('joinCountryPopulation', () => {
  it('should attach the population of a matching id to the country properties', () => {
    const israel = createCountry({ id: '376', name: 'Israel' });

    const expectedResult = [{ ...israel, properties: { name: 'Israel', population: 9.2 } }];
    const { populatedCountries: actualResult } = joinCountryPopulation({
      countries: [israel],
      populationById: { '376': 9.2 },
    });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should keep countries without a value apart instead of treating them as zero', () => {
    const antarctica = createCountry({ id: '010', name: 'Antarctica' });

    const expectedResult = [antarctica];
    const { countriesWithoutData: actualResult } = joinCountryPopulation({
      countries: [antarctica],
      populationById: {},
    });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should treat a country without an id as having no data', () => {
    const kosovo = createCountry({ name: 'Kosovo' });

    const expectedResult = [kosovo];
    const { countriesWithoutData: actualResult } = joinCountryPopulation({
      countries: [kosovo],
      populationById: { '376': 9.2 },
    });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should keep a population of zero as data', () => {
    const emptyLand = createCountry({ id: '999', name: 'Empty Land' });

    const expectedResult = [{ ...emptyLand, properties: { name: 'Empty Land', population: 0 } }];
    const { populatedCountries: actualResult } = joinCountryPopulation({
      countries: [emptyLand],
      populationById: { '999': 0 },
    });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should report ids that matched no country', () => {
    const israel = createCountry({ id: '376', name: 'Israel' });

    const expectedResult = ['250'];
    const { unmatchedIds: actualResult } = joinCountryPopulation({
      countries: [israel],
      populationById: { '376': 9.2, '250': 68.2 },
    });

    expect(actualResult).toEqual(expectedResult);
  });
});
