import type { CountryFeature, PopulatedCountryFeature } from '../types';

type JoinCountryPopulationProps = {
  countries: Array<CountryFeature>;
  populationById: Record<string, number>;
};

type JoinCountryPopulationResult = {
  populatedCountries: Array<PopulatedCountryFeature>;
  countriesWithoutData: Array<CountryFeature>;
  /**
   * Ids present in `populationById` that matched no country feature.
   */
  unmatchedIds: Array<string>;
};

/**
 * Joins population values onto country features by their ISO numeric `id`.
 * A country with no value is kept apart rather than treated as zero.
 */
export function joinCountryPopulation(props: JoinCountryPopulationProps): JoinCountryPopulationResult {
  const { countries, populationById } = props;

  const populatedCountries: Array<PopulatedCountryFeature> = [];
  const countriesWithoutData: Array<CountryFeature> = [];
  const matchedIds = new Set<string>();

  countries.forEach((country) => {
    const id = country.id === undefined ? undefined : String(country.id);
    const population = id === undefined ? undefined : populationById[id];

    if (id === undefined || population === undefined) {
      countriesWithoutData.push(country);
      return;
    }

    matchedIds.add(id);
    populatedCountries.push({ ...country, properties: { ...country.properties, population } });
  });

  const unmatchedIds = Object.keys(populationById).filter((id) => !matchedIds.has(id));

  return { populatedCountries, countriesWithoutData, unmatchedIds };
}
