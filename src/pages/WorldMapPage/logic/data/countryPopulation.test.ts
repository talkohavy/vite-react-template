import { describe, expect, it } from 'vite-plus/test';
import { getCountryPopulationRow } from './countryPopulation';
import { loadCountries } from './loadCountries';
import { WORLD_COUNTRIES } from './worldCountries';

function findCountry(name: string) {
  const country = WORLD_COUNTRIES.find((feature) => feature.properties.name === name)!;

  return country;
}

describe('getCountryPopulationRow', () => {
  it('should join a country to the row with its ISO code', () => {
    const france = findCountry('France');
    const expectedResult = { isoCode: '250', name: 'France', population: 67059887 };

    const actualResult = getCountryPopulationRow({ country: france });

    expect(actualResult).toMatchObject(expectedResult);
  });

  it('should join by code even when the names differ', () => {
    const congo = findCountry('Dem. Rep. Congo');
    const expectedResult = 'Democratic Republic of the Congo';

    const actualResult = getCountryPopulationRow({ country: congo })?.name;

    expect(actualResult).toBe(expectedResult);
  });

  it('should return null for a country without an ISO code', () => {
    const kosovo = findCountry('Kosovo');

    const actualResult = getCountryPopulationRow({ country: kosovo });

    expect(actualResult).toBeNull();
  });

  it("should give a territory sharing Australia's code Australia's row", async () => {
    const countries = await loadCountries({ resolution: '50m' });
    const ashmore = countries.find((country) => country.properties.name === 'Ashmore and Cartier Is.')!;
    const expectedResult = 'Australia';

    const actualResult = getCountryPopulationRow({ country: ashmore })?.name;

    expect(actualResult).toBe(expectedResult);
  });

  it('should find a row for every 1:10m country that has an ISO code', async () => {
    const countries = await loadCountries({ resolution: '10m' });
    const countriesWithCode = countries.filter((country) => country.id !== undefined);

    const unmatchedNames = countriesWithCode
      .filter((country) => getCountryPopulationRow({ country }) === null)
      .map((country) => country.properties.name);

    expect(unmatchedNames).toEqual([]);
  });
});
