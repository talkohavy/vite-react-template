export type MapStyleName = 'liberty' | 'bright' | 'positron' | 'dark';

type MapStyle = {
  label: string;
  url: string;
};

/**
 * OpenFreeMap's styles all paint the same OpenMapTiles vector data, so switching one only re-styles the tiles already
 * downloaded. OpenFreeMap needs no API key, on localhost or anywhere else.
 */
export const MAP_STYLES: Record<MapStyleName, MapStyle> = {
  liberty: { label: 'Liberty', url: 'https://tiles.openfreemap.org/styles/liberty' },
  bright: { label: 'Bright', url: 'https://tiles.openfreemap.org/styles/bright' },
  positron: { label: 'Positron', url: 'https://tiles.openfreemap.org/styles/positron' },
  dark: { label: 'Dark', url: 'https://tiles.openfreemap.org/styles/dark' },
};

export const INITIAL_STYLE_NAME: MapStyleName = 'liberty';

export type MapProjectionName = 'mercator' | 'globe';

/**
 * The deepest level OpenFreeMap cuts its vector tiles at. Deeper zooms redraw the level 14 shapes bigger, which stays
 * sharp because they are shapes, not pixels.
 */
export const MAX_VECTOR_TILE_LEVEL = 14;

export const INITIAL_VIEW = {
  center: [0, 20] as [number, number],
  zoom: 1,
};

export type VectorPlace = {
  name: string;
  center: [number, number];
  zoom: number;
};

/**
 * Zooms are MapLibre's, whose 512-pixel tiles make each zoom one less than the 256-pixel tile level showing as much.
 */
export const VECTOR_PLACES: Array<VectorPlace> = [
  { name: "Ra'anana", center: [34.871685, 32.1845145], zoom: 14.5 },
  { name: 'Eiffel Tower', center: [2.2945, 48.8584], zoom: 16 },
  { name: 'Central Park', center: [-73.9654, 40.7829], zoom: 13 },
  { name: 'Sydney Opera House', center: [151.2153, -33.8568], zoom: 16 },
];
