import { defineChart } from '@tanstack/charts';
import { geoShape } from '@tanstack/charts/geo';
import { decorative } from '@tanstack/charts/mark/decorative';
import { tooltip } from '@tanstack/charts/tooltip';
import { geoNaturalEarth1, type GeoSphere } from 'd3-geo';
import { scaleSqrt } from 'd3-scale';
import { BORDER_COLOR, CONTINENT_COLOR_OPTIONS, FOCUSED_SHAPE_STATES, LAND_COLOR, OCEAN_COLOR } from '../constants';
import { CITIES } from '../data/cities';
import { WORLD_LAND } from '../data/worldAtlas';
import { buildCityFeatures } from '../utils/buildCityFeatures';
import { createZoomedProjection } from '../utils/createZoomedProjection';
import { formatPopulation } from '../utils/formatPopulation';
import type { MapZoomTransform } from '../types';

const SPHERE: GeoSphere = { type: 'Sphere' };

const cityFeatures = buildCityFeatures({ cities: CITIES });

/**
 * Bubble area, not radius, should be proportional to population, hence a square-root scale.
 * Radii are in pixels, so bubbles keep their size while the map zooms underneath them.
 */
const radiusScale = scaleSqrt().domain([0, 40]).range([0, 24]);

export function buildBubbleMapDefinition(props: { transform: MapZoomTransform }) {
  const { transform } = props;

  const projection = createZoomedProjection({ createProjection: geoNaturalEarth1, fitObject: SPHERE, transform });

  const definition = defineChart({
    clip: true,
    marks: [
      decorative(geoShape([SPHERE], { projection, fill: OCEAN_COLOR })),
      decorative(geoShape(WORLD_LAND, { projection, fill: LAND_COLOR, stroke: BORDER_COLOR, strokeWidth: 0.5 })),
      geoShape(cityFeatures, {
        key: (city) => city.properties.name,
        projection,
        r: (city) => city.properties.population,
        rScale: radiusScale,
        color: (city) => city.properties.continent,
        fillOpacity: 0.7,
        stroke: BORDER_COLOR,
        strokeWidth: 1,
        states: FOCUSED_SHAPE_STATES,
      }),
    ],
    scales: { x: null, y: null },
    color: CONTINENT_COLOR_OPTIONS,
    tooltip: {
      use: tooltip,
      format: (point) => {
        const { name, country, population } = point.datum.properties;
        const formattedPopulation = formatPopulation({ millions: population });

        return `${name}, ${country}: ${formattedPopulation}`;
      },
    },
  });

  return definition;
}
