import countryPopulationJson from './countryPopulation.json';
import type { CountryFeature } from './worldCountries';

/**
 * Population is Natural Earth's POP_EST, keyed by its ISO_N3_EH code.
 * areaKm2 is measured with geoArea from the world-atlas 1:10m outlines, summed over every feature sharing the code.
 */
export type CountryPopulationRow = {
  isoCode: string;
  name: string;
  population: number;
  year: number;
  areaKm2: number;
};

export const COUNTRY_POPULATION_ROWS: Array<CountryPopulationRow> = countryPopulationJson;

const ROWS_BY_ISO_CODE = new Map(COUNTRY_POPULATION_ROWS.map((row) => [row.isoCode, row]));

type GetCountryPopulationRowProps = { country: CountryFeature };

export function getCountryPopulationRow(props: GetCountryPopulationRowProps) {
  const { country } = props;

  if (country.id === undefined) return null;

  const row = ROWS_BY_ISO_CODE.get(String(country.id)) ?? null;

  return row;
}
