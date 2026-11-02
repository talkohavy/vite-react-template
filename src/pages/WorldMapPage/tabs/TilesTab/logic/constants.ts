export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 480;

/**
 * At 1x the square Web Mercator world is as wide as the map, so only its middle half fits vertically.
 */
export const BASE_WORLD_SIZE = MAP_WIDTH;

export const TILE_SIZE = 256;

/**
 * The deepest zoom level tile.openstreetmap.org serves.
 */
export const MAX_TILE_ZOOM = 19;

export const TILE_URL_TEMPLATE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const EARTH_CIRCUMFERENCE_METERS = 2 * Math.PI * 6378137;

export type Place = {
  name: string;
  longitude: number;
  latitude: number;
  tileZoom: number;
};

export const PLACES: Array<Place> = [
  { name: 'Eiffel Tower', longitude: 2.2945, latitude: 48.8584, tileZoom: 17 },
  { name: 'Central Park', longitude: -73.9654, latitude: 40.7829, tileZoom: 14 },
  { name: 'Sydney Opera House', longitude: 151.2153, latitude: -33.8568, tileZoom: 17 },
];
