import { useEffect, useRef, useState } from 'react';
import { Map as MapLibreMap, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import {
  INITIAL_STYLE_NAME,
  INITIAL_VIEW,
  MAP_STYLES,
  type MapProjectionName,
  type MapStyleName,
  type VectorPlace,
} from './constants';

// MapLibre looks for its worker next to its own module, which isn't where Vite serves or bundles it.
setWorkerUrl(maplibreWorkerUrl);

/**
 * Owns a MapLibre map that draws vector tiles with WebGL at the screen's pixel density.
 */
export function useMapLibreMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const projectionRef = useRef<MapProjectionName>('mercator');
  /**
   * MapLibre throws when the projection is set before the style has loaded, and every style swap reloads it.
   */
  const isStyleLoadedRef = useRef(false);

  const [styleName, setStyleName] = useState<MapStyleName>(INITIAL_STYLE_NAME);
  const [projection, setProjection] = useState<MapProjectionName>('mercator');
  const [zoom, setZoom] = useState(INITIAL_VIEW.zoom);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const map = new MapLibreMap({
      container,
      style: MAP_STYLES[INITIAL_STYLE_NAME].url,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      attributionControl: {
        customAttribution: '<a href="https://routing.openstreetmap.de/" target="_blank">Routes: FOSSGIS OSRM</a>',
      },
    });
    map.addControl(new NavigationControl(), 'top-right');
    // A new style comes without a projection, so the chosen one is put back on every load.
    map.on('style.load', () => {
      isStyleLoadedRef.current = true;
      map.setProjection({ type: projectionRef.current });
    });
    map.on('zoom', () => setZoom(map.getZoom()));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      isStyleLoadedRef.current = false;
    };
  }, []);

  function changeStyle(nextStyleName: MapStyleName) {
    setStyleName(nextStyleName);
    isStyleLoadedRef.current = false;
    mapRef.current?.setStyle(MAP_STYLES[nextStyleName].url, { diff: false });
  }

  function changeProjection(nextProjection: MapProjectionName) {
    setProjection(nextProjection);
    projectionRef.current = nextProjection;

    if (isStyleLoadedRef.current) mapRef.current?.setProjection({ type: nextProjection });
  }

  function flyToPlace(place: VectorPlace) {
    const { center, zoom: placeZoom } = place;

    mapRef.current?.flyTo({ center, zoom: placeZoom, bearing: 0, pitch: 0 });
  }

  function resetView() {
    mapRef.current?.flyTo({ ...INITIAL_VIEW, bearing: 0, pitch: 0 });
  }

  return { containerRef, mapRef, styleName, changeStyle, projection, changeProjection, zoom, flyToPlace, resetView };
}
