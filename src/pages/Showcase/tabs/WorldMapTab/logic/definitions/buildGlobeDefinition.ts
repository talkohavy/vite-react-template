import { defineChart } from '@tanstack/charts';
import { geoShape } from '@tanstack/charts/geo';
import { decorative } from '@tanstack/charts/mark/decorative';
import { tooltip } from '@tanstack/charts/tooltip';
import { geoGraticule10, geoOrthographic, type GeoSphere } from 'd3-geo';
import {
  BORDER_COLOR,
  FOCUSED_SHAPE_STATES,
  GRATICULE_COLOR,
  NO_DATA_COLOR,
  OCEAN_COLOR,
  POPULATION_COLOR_OPTIONS,
} from '../constants';
import { POPULATION_BY_COUNTRY_ID } from '../data/populationByCountryId';
import { WORLD_COUNTRIES } from '../data/worldAtlas';
import { formatPopulation } from '../utils/formatPopulation';
import { joinCountryPopulation } from '../utils/joinCountryPopulation';

const SPHERE: GeoSphere = { type: 'Sphere' };

const GRATICULE = geoGraticule10();

const { populatedCountries, countriesWithoutData } = joinCountryPopulation({
  countries: WORLD_COUNTRIES,
  populationById: POPULATION_BY_COUNTRY_ID,
});

type BuildGlobeDefinitionProps = {
  /**
   * The longitude, in degrees, facing the viewer.
   */
  longitude: number;
  /**
   * The latitude, in degrees, facing the viewer.
   */
  latitude: number;
};

export function buildGlobeDefinition(props: BuildGlobeDefinitionProps) {
  const { longitude, latitude } = props;

  // The orthographic projection clips the far hemisphere, so hidden countries emit no focus point.
  const projection = {
    type: () => geoOrthographic().rotate([-longitude, -latitude]),
    fit: 'sphere' as const,
    inset: 4,
  };

  const definition = defineChart({
    marks: [
      decorative(geoShape([SPHERE], { projection, fill: OCEAN_COLOR })),
      decorative(geoShape([GRATICULE], { projection, fill: 'none', stroke: GRATICULE_COLOR, strokeWidth: 0.5 })),
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
