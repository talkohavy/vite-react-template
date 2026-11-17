import {
  ALTERNATIVE_ROUTE_COLOR,
  ROUTE_CASING_LAYER_ID,
  ROUTE_CLICK_TOLERANCE,
  ROUTE_COLOR,
  ROUTE_LINE_LAYER_ID,
  ROUTE_SOURCE_ID,
} from './constants';
import type { ExpressionSpecification, GeoJSONSource, Map as MapLibreMap, Point } from 'maplibre-gl';

type RouteFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.LineString>;

const LINE_WIDTH: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 8, 3, 16, 8];
const CASING_WIDTH: ExpressionSpecification = ['interpolate', ['linear'], ['zoom'], 8, 5, 16, 12];

/**
 * Draws the chosen route above the alternatives it crosses.
 */
const SELECTED_ON_TOP: ExpressionSpecification = ['case', ['get', 'selected'], 1, 0];

type AddRouteLayersProps = {
  map: MapLibreMap;
  data: RouteFeatureCollection;
};

/**
 * A new style drops every source and layer added to the old one, so this runs again after each style load.
 * The routes go above every road and area but under the labels drawn after them, so names stay readable. Some styles
 * put a few labels early, so going under the first label would hide the route under later roads.
 */
export function addRouteLayers(props: AddRouteLayersProps) {
  const { map, data } = props;

  if (map.getSource(ROUTE_SOURCE_ID)) return;

  const { layers } = map.getStyle();
  const lastShapeLayerIndex = layers.reduce(
    (lastIndex, { type }, index) => (type === 'symbol' ? lastIndex : index),
    -1,
  );
  const firstLabelLayerId = layers[lastShapeLayerIndex + 1]?.id;

  map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data });
  map.addLayer(
    {
      id: ROUTE_CASING_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round', 'line-sort-key': SELECTED_ON_TOP },
      paint: { 'line-color': '#ffffff', 'line-width': CASING_WIDTH },
    },
    firstLabelLayerId,
  );
  map.addLayer(
    {
      id: ROUTE_LINE_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round', 'line-sort-key': SELECTED_ON_TOP },
      paint: {
        'line-color': ['case', ['get', 'selected'], ROUTE_COLOR, ALTERNATIVE_ROUTE_COLOR],
        'line-width': LINE_WIDTH,
      },
    },
    firstLabelLayerId,
  );
}

type SetRouteDataProps = AddRouteLayersProps;

export function setRouteData(props: SetRouteDataProps) {
  const { map, data } = props;

  const source = map.getSource<GeoJSONSource>(ROUTE_SOURCE_ID);
  source?.setData(data);
}

type FindClickedRouteIndexProps = {
  map: MapLibreMap;
  point: Point;
};

/**
 * The route under a click, or `null`. The chosen route is drawn on top, so it wins where routes overlap.
 */
export function findClickedRouteIndex(props: FindClickedRouteIndexProps) {
  const { map, point } = props;

  if (!map.getLayer(ROUTE_LINE_LAYER_ID)) return null;

  const { x, y } = point;
  const features = map.queryRenderedFeatures(
    [
      [x - ROUTE_CLICK_TOLERANCE, y - ROUTE_CLICK_TOLERANCE],
      [x + ROUTE_CLICK_TOLERANCE, y + ROUTE_CLICK_TOLERANCE],
    ],
    { layers: [ROUTE_LINE_LAYER_ID] },
  );
  const routeIndex = features[0]?.properties.routeIndex as number | undefined;

  return routeIndex ?? null;
}
