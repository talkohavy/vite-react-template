export type LngLat = [number, number];

export type TravelModeName = 'foot' | 'bike' | 'car';

type TravelMode = {
  label: string;
  routerUrl: string;
};

/**
 * FOSSGIS runs a separate OSRM server per profile, the ones openstreetmap.org's own directions use. They need no API
 * key but ask for fair use, so a site with real traffic should run its own OSRM or pay a routing provider.
 */
export const TRAVEL_MODES: Record<TravelModeName, TravelMode> = {
  foot: { label: 'Walk', routerUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1/driving' },
  bike: { label: 'Bike', routerUrl: 'https://routing.openstreetmap.de/routed-bike/route/v1/driving' },
  car: { label: 'Car', routerUrl: 'https://routing.openstreetmap.de/routed-car/route/v1/driving' },
};

export const TRAVEL_MODE_NAMES = Object.keys(TRAVEL_MODES) as Array<TravelModeName>;

export const INITIAL_TRAVEL_MODE: TravelModeName = 'foot';

/**
 * Ramat Gan to Keren HaYesod 20, Ra'anana.
 */
export const INITIAL_ORIGIN: LngLat = [34.8045, 32.0836];
export const INITIAL_DESTINATION: LngLat = [34.871685, 32.1845145];

export const ROUTE_SOURCE_ID = 'directions-routes';
export const ROUTE_CASING_LAYER_ID = 'directions-route-casing';
export const ROUTE_LINE_LAYER_ID = 'directions-route-line';

export const ROUTE_COLOR = '#d6337a';
export const ALTERNATIVE_ROUTE_COLOR = '#8796aa';
export const DESTINATION_COLOR = '#0ea5d8';

/**
 * Keeps the route clear of the directions panel along the bottom of the map.
 */
export const ROUTE_FIT_PADDING = { top: 60, bottom: 170, left: 60, right: 60 };

/**
 * How far from a route, in pixels, a click still counts as picking it.
 */
export const ROUTE_CLICK_TOLERANCE = 6;
