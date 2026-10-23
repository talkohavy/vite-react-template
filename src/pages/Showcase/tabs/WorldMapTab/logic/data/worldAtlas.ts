import { feature } from 'topojson-client';
import worldAtlasTopology from 'world-atlas/countries-110m.json';
import type { CountryFeature, CountryProperties } from '../types';
import type { GeometryCollection, Objects, Topology } from 'topojson-specification';

type WorldAtlasObjects = Objects<CountryProperties> & {
  countries: GeometryCollection<CountryProperties>;
  land: GeometryCollection;
};

const ANTARCTICA_ID = '010';

const topology = worldAtlasTopology as unknown as Topology<WorldAtlasObjects>;

const countriesCollection = feature(topology, topology.objects.countries);
const landCollection = feature(topology, topology.objects.land);

export const WORLD_COUNTRIES: Array<CountryFeature> = countriesCollection.features;

/**
 * Antarctica dominates flat projections (and explodes under Mercator), so flat maps leave it out.
 */
export const FLAT_MAP_COUNTRIES: Array<CountryFeature> = WORLD_COUNTRIES.filter(
  (country) => country.id !== ANTARCTICA_ID,
);

export const FLAT_MAP_EXTENT: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: FLAT_MAP_COUNTRIES };

export const WORLD_LAND: Array<GeoJSON.Feature> = landCollection.features;
