import { useEffect, useRef, useState, type RefObject } from 'react';
import { Marker, type Map as MapLibreMap, type MapMouseEvent } from 'maplibre-gl';
import {
  DESTINATION_COLOR,
  INITIAL_DESTINATION,
  INITIAL_ORIGIN,
  INITIAL_TRAVEL_MODE,
  ROUTE_FIT_PADDING,
  ROUTE_LINE_LAYER_ID,
  type LngLat,
  type TravelModeName,
} from './constants';
import { getRouteBounds } from './getRouteBounds';
import { getRouteFeatures } from './getRouteFeatures';
import { addRouteLayers, findClickedRouteIndex, setRouteData } from './routeLayers';
import { useRoutes } from './useRoutes';
import type { Route } from './fetchRoutes';

type RouteSelection = {
  routes: Array<Route> | null;
  index: number;
};

function createOriginElement() {
  const element = document.createElement('div');
  element.className =
    'size-5 rounded-full border-[3px] border-white bg-[#d6337a] shadow-md ring-8 ring-[#d6337a]/25 cursor-grab';
  element.setAttribute('aria-label', 'Starting point');

  return element;
}

function toLngLat(marker: Marker): LngLat {
  const { lng, lat } = marker.getLngLat();

  return [lng, lat];
}

/**
 * Directions on the MapLibre map: a draggable start and destination, the routes between them for the chosen way of
 * travel, and clicks that either pick a route or move the destination.
 */
export function useDirections(mapRef: RefObject<MapLibreMap | null>) {
  const [travelMode, setTravelMode] = useState<TravelModeName>(INITIAL_TRAVEL_MODE);
  const [origin, setOrigin] = useState<LngLat>(INITIAL_ORIGIN);
  const [destination, setDestination] = useState<LngLat>(INITIAL_DESTINATION);
  const [selection, setSelection] = useState<RouteSelection>({ routes: null, index: 0 });
  const [locateErrorMessage, setLocateErrorMessage] = useState<string | null>(null);

  const originMarkerRef = useRef<Marker | null>(null);
  const destinationMarkerRef = useRef<Marker | null>(null);
  const routesRef = useRef<Array<Route>>([]);
  const routeFeaturesRef = useRef(getRouteFeatures({ routes: [], selectedRouteIndex: 0 }));
  /**
   * Re-framing the map suits a new trip, but not a point the user just dragged or clicked while looking right at it.
   */
  const shouldFitRoutesRef = useRef(true);

  const { routes, isLoading, errorMessage } = useRoutes({ travelMode, origin, destination });
  const selectedRouteIndex = selection.routes === routes ? selection.index : 0;

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    const originMarker = new Marker({ element: createOriginElement(), draggable: true })
      .setLngLat(INITIAL_ORIGIN)
      .addTo(map);
    const destinationMarker = new Marker({ color: DESTINATION_COLOR, draggable: true })
      .setLngLat(INITIAL_DESTINATION)
      .addTo(map);
    originMarkerRef.current = originMarker;
    destinationMarkerRef.current = destinationMarker;

    originMarker.on('dragend', () => {
      shouldFitRoutesRef.current = false;
      setOrigin(toLngLat(originMarker));
    });
    destinationMarker.on('dragend', () => {
      shouldFitRoutesRef.current = false;
      setDestination(toLngLat(destinationMarker));
    });

    function handleStyleLoad() {
      addRouteLayers({ map: map!, data: routeFeaturesRef.current });
    }

    function handleClick(event: MapMouseEvent) {
      const target = event.originalEvent.target as Element | null;

      if (target?.closest('.maplibregl-marker')) return;

      const routeIndex = findClickedRouteIndex({ map: map!, point: event.point });

      if (routeIndex !== null) {
        setSelection({ routes: routesRef.current, index: routeIndex });
        return;
      }

      shouldFitRoutesRef.current = false;
      setDestination([event.lngLat.lng, event.lngLat.lat]);
    }

    function showPointer() {
      map!.getCanvas().style.cursor = 'pointer';
    }

    function hidePointer() {
      map!.getCanvas().style.cursor = '';
    }

    map.on('style.load', handleStyleLoad);
    map.on('click', handleClick);
    map.on('mouseenter', ROUTE_LINE_LAYER_ID, showPointer);
    map.on('mouseleave', ROUTE_LINE_LAYER_ID, hidePointer);

    return () => {
      map.off('style.load', handleStyleLoad);
      map.off('click', handleClick);
      map.off('mouseenter', ROUTE_LINE_LAYER_ID, showPointer);
      map.off('mouseleave', ROUTE_LINE_LAYER_ID, hidePointer);
      originMarker.remove();
      destinationMarker.remove();
      originMarkerRef.current = null;
      destinationMarkerRef.current = null;
    };
  }, [mapRef]);

  useEffect(() => {
    originMarkerRef.current?.setLngLat(origin);
  }, [origin]);

  useEffect(() => {
    destinationMarkerRef.current?.setLngLat(destination);
  }, [destination]);

  useEffect(() => {
    const routeFeatures = getRouteFeatures({ routes, selectedRouteIndex });
    routesRef.current = routes;
    routeFeaturesRef.current = routeFeatures;

    const map = mapRef.current;

    if (map) setRouteData({ map, data: routeFeatures });
  }, [mapRef, routes, selectedRouteIndex]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !shouldFitRoutesRef.current || routes.length === 0) return;

    shouldFitRoutesRef.current = false;

    const routePoints = routes.flatMap(({ geometry }) => geometry.coordinates as Array<LngLat>);
    const bounds = getRouteBounds(routePoints);
    map.fitBounds(bounds, { padding: ROUTE_FIT_PADDING, maxZoom: 16 });
  }, [mapRef, routes]);

  function changeTravelMode(nextTravelMode: TravelModeName) {
    shouldFitRoutesRef.current = true;
    setLocateErrorMessage(null);
    setTravelMode(nextTravelMode);
  }

  function selectRoute(index: number) {
    setSelection({ routes, index });
  }

  function startFromMyLocation() {
    if (!('geolocation' in navigator)) {
      setLocateErrorMessage("This browser can't share its location.");
      return;
    }

    setLocateErrorMessage(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        shouldFitRoutesRef.current = true;
        setOrigin([coords.longitude, coords.latitude]);
      },
      () => setLocateErrorMessage("Couldn't get your location."),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  return {
    travelMode,
    changeTravelMode,
    routes,
    selectedRouteIndex,
    selectRoute,
    isLoading,
    errorMessage: locateErrorMessage ?? errorMessage,
    startFromMyLocation,
  };
}
