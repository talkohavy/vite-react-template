import { defineChart } from '@tanstack/charts';
import { geoShape } from '@tanstack/charts/geo';
import { decorative } from '@tanstack/charts/mark/decorative';
import { tooltip } from '@tanstack/charts/tooltip';
import {
  BORDER_COLOR,
  FLAT_PROJECTIONS,
  FOCUSED_SHAPE_STATES,
  NO_DATA_COLOR,
  POPULATION_COLOR_OPTIONS,
  type FlatProjectionName,
} from '../constants';
import { POPULATION_BY_COUNTRY_ID } from '../data/populationByCountryId';
import { FLAT_MAP_COUNTRIES, FLAT_MAP_EXTENT } from '../data/worldAtlas';
import { formatPopulation } from '../utils/formatPopulation';
import { joinCountryPopulation } from '../utils/joinCountryPopulation';

const { populatedCountries, countriesWithoutData } = joinCountryPopulation({
  countries: FLAT_MAP_COUNTRIES,
  populationById: POPULATION_BY_COUNTRY_ID,
});

export function buildChoroplethDefinition(props: { projectionName: FlatProjectionName }) {
  const { projectionName } = props;

  // Both layers fit the same geometry, so they share one projection frame.
  const projection = { type: FLAT_PROJECTIONS[projectionName], fit: FLAT_MAP_EXTENT, inset: 4 };

  const definition = defineChart({
    marks: [
      decorative(
        geoShape(countriesWithoutData, {
          key: (country) => country.properties.name,
          projection,
          fill: NO_DATA_COLOR,
          stroke: BORDER_COLOR,
          strokeWidth: 0.5,
        }),
      ),
      geoShape(populatedCountries, {
        key: (country) => country.properties.name,
        projection,
        color: (country) => country.properties.population,
        stroke: BORDER_COLOR,
        strokeWidth: 0.5,
        states: FOCUSED_SHAPE_STATES,
      }),
    ],
    scales: { x: null, y: null },
    color: POPULATION_COLOR_OPTIONS,
    tooltip: {
      use: tooltip,
      anchor: 'pointer',
      format: (point) => {
        const { name, population } = point.datum.properties;
        const formattedPopulation = formatPopulation({ millions: population });

        return `${name}: ${formattedPopulation}`;
      },
    },
  });

  return definition;
}
