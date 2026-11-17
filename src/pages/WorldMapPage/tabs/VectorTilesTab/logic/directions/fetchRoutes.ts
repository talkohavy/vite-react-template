import { TRAVEL_MODES, type LngLat, type TravelModeName } from './constants';

export type Route = {
  /**
   * Meters.
   */
  distance: number;
  /**
   * Seconds.
   */
  duration: number;
  geometry: GeoJSON.LineString;
};

type OsrmResponse = {
  code: string;
  routes?: Array<Route>;
};

type FetchRoutesProps = {
  travelMode: TravelModeName;
  origin: LngLat;
  destination: LngLat;
  signal?: AbortSignal;
};

/**
 * Asks OSRM for the best route and any reasonable alternatives. An empty list means there is no way through.
 */
export async function fetchRoutes(props: FetchRoutesProps) {
  const { travelMode, origin, destination, signal } = props;

  const coordinates = `${origin.join(',')};${destination.join(',')}`;
  const url = `${TRAVEL_MODES[travelMode].routerUrl}/${coordinates}?overview=full&geometries=geojson&alternatives=true`;
  const response = await fetch(url, { signal });
  const body = (await response.json()) as OsrmResponse;

  if (body.code === 'NoRoute') return [];

  if (!response.ok || body.code !== 'Ok') throw new Error(`Routing failed with ${body.code}`);

  const routes = (body.routes ?? []).map(({ distance, duration, geometry }) => ({ distance, duration, geometry }));

  return routes;
}
