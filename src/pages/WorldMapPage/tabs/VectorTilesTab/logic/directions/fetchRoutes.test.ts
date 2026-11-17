import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { fetchRoutes } from './fetchRoutes';
import type { LngLat } from './constants';

const ROUTE = {
  distance: 16_510,
  duration: 13_200,
  geometry: {
    type: 'LineString',
    coordinates: [
      [34.8, 32.08],
      [34.87, 32.18],
    ],
  },
};

const TRIP: { origin: LngLat; destination: LngLat } = {
  origin: [34.8045, 32.0836],
  destination: [34.871685, 32.1845145],
};

function stubFetch(props: { status: number; body: unknown }) {
  const { status, body } = props;

  const fetchMock = vi.fn(async (_url: string) => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchRoutes', () => {
  it("should ask the travel mode's own server for full routes with alternatives", async () => {
    const expectedResult =
      'https://routing.openstreetmap.de/routed-bike/route/v1/driving/34.8045,32.0836;34.871685,32.1845145?overview=full&geometries=geojson&alternatives=true';
    const fetchMock = stubFetch({ status: 200, body: { code: 'Ok', routes: [ROUTE] } });

    await fetchRoutes({ travelMode: 'bike', ...TRIP });
    const actualResult = fetchMock.mock.calls[0]![0];

    expect(actualResult).toBe(expectedResult);
  });

  it('should return the distance, duration and line of each route', async () => {
    const expectedResult = [ROUTE];
    stubFetch({ status: 200, body: { code: 'Ok', routes: [{ ...ROUTE, legs: [], weight: 1 }] } });

    const actualResult = await fetchRoutes({ travelMode: 'foot', ...TRIP });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should return no routes when there is no way through', async () => {
    const expectedResult: Array<unknown> = [];
    stubFetch({ status: 400, body: { code: 'NoRoute' } });

    const actualResult = await fetchRoutes({ travelMode: 'car', ...TRIP });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should throw when the server fails', async () => {
    stubFetch({ status: 500, body: { code: 'InvalidQuery' } });

    const routesPromise = fetchRoutes({ travelMode: 'car', ...TRIP });

    await expect(routesPromise).rejects.toThrow('Routing failed with InvalidQuery');
  });
});
