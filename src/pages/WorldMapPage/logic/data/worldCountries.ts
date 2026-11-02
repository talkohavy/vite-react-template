import { feature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import { rewindInvertedPolygons } from '../utils/rewindInvertedPolygons';
import type { GeometryCollection, Topology } from 'topojson-specification';

export type CountryProperties = {
  name: string;
};

export type CountryFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, CountryProperties>;

type CountriesObjects = {
  countries: GeometryCollection<CountryProperties>;
};

type ToCountryFeaturesProps = {
  /**
   * Any of the `world-atlas/countries-*.json` files.
   */
  topologyJson: unknown;
};

export function toCountryFeatures(props: ToCountryFeaturesProps) {
  const { topologyJson } = props;

  const topology = topologyJson as Topology<CountriesObjects>;
  const countriesCollection = feature(topology, topology.objects.countries);
  const countries = countriesCollection.features as Array<CountryFeature>;

  // In 1:10m, a few islets roughly 400m across get snapped to 3 neighbouring grid points and come out wound the wrong way.
  const rewoundCountries = countries.map((country) => rewindInvertedPolygons({ feature: country }));

  return rewoundCountries;
}

/**
 * One feature per country (Natural Earth, 1:110m). `id` is the ISO 3166-1 numeric code, and is missing for the
 * few places that don't have one (N. Cyprus, Somaliland, Kosovo).
 */
export const WORLD_COUNTRIES = toCountryFeatures({ topologyJson: countriesTopology });
