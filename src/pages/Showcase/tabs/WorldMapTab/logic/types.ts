export type CountryProperties = {
  name: string;
};

export type CountryFeature = GeoJSON.Feature<GeoJSON.Geometry, CountryProperties>;

export type PopulatedCountryFeature = GeoJSON.Feature<GeoJSON.Geometry, CountryProperties & { population: number }>;

export type Continent = 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania';

export type City = {
  name: string;
  country: string;
  continent: Continent;
  /**
   * Metro-area population, in millions.
   */
  population: number;
  coordinates: [longitude: number, latitude: number];
};

/**
 * A screen-space zoom: scale by `k`, then translate by `x`,`y` pixels (same shape as a d3-zoom transform).
 */
export type MapZoomTransform = {
  k: number;
  x: number;
  y: number;
};

export type CityFeature = GeoJSON.Feature<GeoJSON.Point, Omit<City, 'coordinates'>>;
