import type { City, CityFeature } from '../types';

/**
 * Converts city rows into GeoJSON Point features, which `geoShape` renders as circles.
 */
export function buildCityFeatures(cities: Array<City>): Array<CityFeature> {
  const features = cities.map((city): CityFeature => {
    const { coordinates, ...properties } = city;

    return {
      type: 'Feature',
      properties,
      geometry: {
        type: 'Point',
        coordinates,
      },
    };
  });

  return features;
}
