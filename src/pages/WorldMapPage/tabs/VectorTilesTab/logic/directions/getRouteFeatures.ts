import type { Route } from './fetchRoutes';

export type RouteFeatureProperties = {
  routeIndex: number;
  selected: boolean;
};

type GetRouteFeaturesProps = {
  routes: Array<Route>;
  selectedRouteIndex: number;
};

/**
 * One line per route, flagged so the style can paint the chosen one on top and the alternatives muted below it.
 */
export function getRouteFeatures(props: GetRouteFeaturesProps) {
  const { routes, selectedRouteIndex } = props;

  const features = routes.map(
    ({ geometry }, routeIndex): GeoJSON.Feature<GeoJSON.LineString, RouteFeatureProperties> => ({
      type: 'Feature',
      properties: { routeIndex, selected: routeIndex === selectedRouteIndex },
      geometry,
    }),
  );
  const featureCollection: GeoJSON.FeatureCollection<GeoJSON.LineString, RouteFeatureProperties> = {
    type: 'FeatureCollection',
    features,
  };

  return featureCollection;
}
