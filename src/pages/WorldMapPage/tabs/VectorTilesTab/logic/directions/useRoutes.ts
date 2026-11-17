import { useEffect, useState } from 'react';
import { fetchRoutes, type Route } from './fetchRoutes';
import type { LngLat, TravelModeName } from './constants';

type RoutesResult = {
  requestKey: string;
  routes: Array<Route>;
  errorMessage: string | null;
};

type UseRoutesProps = {
  travelMode: TravelModeName;
  origin: LngLat;
  destination: LngLat;
};

/**
 * Fetches the routes for a trip, dropping the answer to any request overtaken by a newer one. The last routes found
 * stay up while the next ones load, so the line doesn't blink away on every change.
 */
export function useRoutes(props: UseRoutesProps) {
  const { travelMode, origin, destination } = props;

  const [result, setResult] = useState<RoutesResult | null>(null);
  const requestKey = `${travelMode}|${origin.join(',')}|${destination.join(',')}`;

  useEffect(() => {
    const controller = new AbortController();

    async function loadRoutes() {
      try {
        const routes = await fetchRoutes({ travelMode, origin, destination, signal: controller.signal });
        const errorMessage = routes.length === 0 ? 'No route found between these two points.' : null;

        setResult({ requestKey, routes, errorMessage });
      } catch {
        if (controller.signal.aborted) return;

        setResult({ requestKey, routes: [], errorMessage: "Couldn't reach the routing server." });
      }
    }

    loadRoutes();

    return () => controller.abort();
  }, [requestKey, travelMode, origin, destination]);

  const isLoading = result?.requestKey !== requestKey;
  const routes = result?.routes ?? [];
  const errorMessage = isLoading ? null : result.errorMessage;

  return { routes, isLoading, errorMessage };
}
