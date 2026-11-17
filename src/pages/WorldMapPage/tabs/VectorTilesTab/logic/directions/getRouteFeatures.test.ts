import { describe, expect, it } from 'vite-plus/test';
import { getRouteFeatures } from './getRouteFeatures';
import type { Route } from './fetchRoutes';

function createRoute(longitude: number): Route {
  const route: Route = {
    distance: 1000,
    duration: 600,
    geometry: {
      type: 'LineString',
      coordinates: [
        [longitude, 32],
        [longitude, 32.1],
      ],
    },
  };

  return route;
}

describe('getRouteFeatures', () => {
  it('should flag only the selected route', () => {
    const expectedResult = [
      { routeIndex: 0, selected: false },
      { routeIndex: 1, selected: true },
    ];

    const { features } = getRouteFeatures({ routes: [createRoute(34.8), createRoute(34.9)], selectedRouteIndex: 1 });
    const actualResult = features.map(({ properties }) => properties);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should keep each route line as it is', () => {
    const expectedResult = createRoute(34.8).geometry;

    const { features } = getRouteFeatures({ routes: [createRoute(34.8)], selectedRouteIndex: 0 });
    const actualResult = features[0]!.geometry;

    expect(actualResult).toEqual(expectedResult);
  });
});
