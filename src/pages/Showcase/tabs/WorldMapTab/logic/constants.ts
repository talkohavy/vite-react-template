import { colorLegend } from '@tanstack/charts';
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal';
import { scaleThreshold } from 'd3-scale';
import { geoEqualEarth, geoEquirectangular, geoMercator, geoNaturalEarth1 } from 'd3-geo';
import type { RadioOption } from '@src/components/controls/RadioButtons';
import type { Continent } from './types';

export const FLAT_PROJECTIONS = {
  equalEarth: geoEqualEarth,
  naturalEarth: geoNaturalEarth1,
  mercator: geoMercator,
  equirectangular: geoEquirectangular,
};

export type FlatProjectionName = keyof typeof FLAT_PROJECTIONS;

export const FLAT_PROJECTION_OPTIONS: Array<RadioOption> = [
  { value: 'equalEarth', label: 'Equal Earth' },
  { value: 'naturalEarth', label: 'Natural Earth' },
  { value: 'mercator', label: 'Mercator' },
  { value: 'equirectangular', label: 'Equirectangular' },
];

export const NO_DATA_COLOR = '#d4d4d8';
export const OCEAN_COLOR = '#dbeafe';
export const LAND_COLOR = '#e5e7eb';
export const BORDER_COLOR = '#ffffff';
export const FOCUSED_BORDER_COLOR = '#111827';
export const GRATICULE_COLOR = '#93c5fd';

/**
 * Bin edges in millions. Population is heavily skewed (two countries above a billion),
 * so explicit thresholds read better than a linear ramp.
 */
const POPULATION_THRESHOLDS = [1, 5, 10, 25, 50, 100, 250];

const POPULATION_COLORS = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'];

export const POPULATION_COLOR_OPTIONS = {
  scale: scaleThreshold<number, string>,
  domain: POPULATION_THRESHOLDS,
  range: POPULATION_COLORS,
  legend: colorLegend({ label: 'Population (millions)', format: (value) => value.toLocaleString('en-US') }),
};

const CONTINENTS: Array<Continent> = ['Asia', 'Africa', 'Europe', 'North America', 'South America', 'Oceania'];

const CONTINENT_COLORS = ['#e15759', '#f28e2b', '#4e79a7', '#59a14f', '#b07aa1', '#76b7b2'];

export const CONTINENT_COLOR_OPTIONS = {
  scale: scaleOrdinal(CONTINENTS, CONTINENT_COLORS),
  legend: colorLegend({ label: 'Continent' }),
};

export const FOCUSED_SHAPE_STATES = [
  { when: { focus: 'primary' as const }, style: { stroke: FOCUSED_BORDER_COLOR, strokeWidth: 1.5 } },
];
