import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import VectorTilesTab from './VectorTilesTab';

const { createdMaps, createdMarkers } = vi.hoisted(() => ({
  createdMaps: [] as Array<FakeMap>,
  createdMarkers: [] as Array<FakeMarker>,
}));

type Handler = (event?: unknown) => void;

type FakeMap = {
  options: { style: string; center: [number, number]; zoom: number };
  handlers: Record<string, Array<Handler>>;
  routeData: unknown;
  hasRouteLayers: boolean;
  clickedRouteIndex: number | null;
  on: (eventName: string, layerIdOrHandler: string | Handler, handler?: Handler) => void;
  off: ReturnType<typeof vi.fn>;
  addControl: ReturnType<typeof vi.fn>;
  setStyle: ReturnType<typeof vi.fn>;
  setProjection: ReturnType<typeof vi.fn>;
  flyTo: ReturnType<typeof vi.fn>;
  fitBounds: ReturnType<typeof vi.fn>;
  getZoom: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  getStyle: () => { layers: Array<{ id: string; type: string }> };
  getSource: (id: string) => { setData: (data: unknown) => void } | undefined;
  addSource: ReturnType<typeof vi.fn>;
  addLayer: ReturnType<typeof vi.fn>;
  getLayer: (id: string) => object | undefined;
  getCanvas: () => HTMLCanvasElement;
  queryRenderedFeatures: () => Array<{ properties: { routeIndex: number } }>;
};

type FakeMarker = {
  options: { color?: string; element?: HTMLElement; draggable: boolean };
  lngLat: [number, number];
  handlers: Record<string, Handler>;
  setLngLat: (lngLat: [number, number]) => FakeMarker;
  getLngLat: () => { lng: number; lat: number };
  addTo: () => FakeMarker;
  on: (eventName: string, handler: Handler) => void;
  remove: ReturnType<typeof vi.fn>;
};

vi.mock('maplibre-gl', () => {
  function Map(this: FakeMap, options: FakeMap['options']) {
    this.options = options;
    this.handlers = {};
    this.routeData = null;
    this.hasRouteLayers = false;
    this.clickedRouteIndex = null;
    this.addControl = vi.fn();
    this.setStyle = vi.fn();
    this.setProjection = vi.fn();
    this.flyTo = vi.fn();
    this.fitBounds = vi.fn();
    this.getZoom = vi.fn(() => 15.4);
    this.remove = vi.fn();
    this.off = vi.fn();
    this.addSource = vi.fn((_id: string, source: { data: unknown }) => {
      this.hasRouteLayers = true;
      this.routeData = source.data;
    });
    this.addLayer = vi.fn();
    this.getStyle = () => ({ layers: [{ id: 'roads', type: 'line' }] });
    this.getSource = () => (this.hasRouteLayers ? { setData: (data) => (this.routeData = data) } : undefined);
    this.getLayer = () => (this.hasRouteLayers ? {} : undefined);
    this.getCanvas = () => document.createElement('canvas');
    this.queryRenderedFeatures = () =>
      this.clickedRouteIndex === null ? [] : [{ properties: { routeIndex: this.clickedRouteIndex } }];
    this.on = (eventName, layerIdOrHandler, handler) => {
      const eventHandler = typeof layerIdOrHandler === 'function' ? layerIdOrHandler : handler!;
      this.handlers[eventName] = [...(this.handlers[eventName] ?? []), eventHandler];
    };
    createdMaps.push(this);
  }

  function Marker(this: FakeMarker, options: FakeMarker['options']) {
    this.options = options;
    this.lngLat = [0, 0];
    this.handlers = {};
    this.setLngLat = (lngLat) => {
      this.lngLat = lngLat;
      return this;
    };
    this.getLngLat = () => ({ lng: this.lngLat[0], lat: this.lngLat[1] });
    this.addTo = () => this;
    this.on = (eventName, handler) => {
      this.handlers[eventName] = handler;
    };
    this.remove = vi.fn();
    createdMarkers.push(this);
  }

  function NavigationControl() {}

  return { Map, Marker, NavigationControl, setWorkerUrl: vi.fn() };
});

function createRoute(props: { distance: number; duration: number }) {
  const route = {
    ...props,
    geometry: {
      type: 'LineString',
      coordinates: [
        [34.8, 32.08],
        [34.87, 32.18],
      ],
    },
  };

  return route;
}

const WALKING_ROUTES = [
  createRoute({ distance: 16_510, duration: 13_200 }),
  createRoute({ distance: 18_180, duration: 14_340 }),
];
const DRIVING_ROUTES = [createRoute({ distance: 17_845, duration: 1_020 })];

let fetchMock: ReturnType<typeof vi.fn>;

function getMap() {
  return createdMaps.at(-1)!;
}

function getOriginMarker() {
  return createdMarkers.find(({ options }) => options.element)!;
}

function getDestinationMarker() {
  return createdMarkers.find(({ options }) => options.color)!;
}

function emitMapEvent(eventName: string, event?: unknown) {
  act(() => {
    getMap().handlers[eventName]!.forEach((handler) => handler(event));
  });
}

function getRequestedUrls() {
  return fetchMock.mock.calls.map(([url]) => url as string);
}

beforeEach(() => {
  createdMaps.length = 0;
  createdMarkers.length = 0;
  fetchMock = vi.fn(async (url: string) => {
    const routes = url.includes('routed-car') ? DRIVING_ROUTES : WALKING_ROUTES;

    return new Response(JSON.stringify({ code: 'Ok', routes }));
  });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('VectorTilesTab', () => {
  it('should start the map on the Liberty style, around the starting trip', () => {
    const expectedResult = {
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [34.838, 32.134],
      zoom: 11,
    };
    render(<VectorTilesTab />);

    const { style, center, zoom } = getMap().options;
    const actualResult = { style, center, zoom };

    expect(actualResult).toEqual(expectedResult);
  });

  it('should fly to a place when jumping to it', () => {
    render(<VectorTilesTab />);

    fireEvent.click(screen.getByRole('button', { name: "Ra'anana" }));

    expect(getMap().flyTo).toHaveBeenCalledWith({ center: [34.871685, 32.1845145], zoom: 14.5, bearing: 0, pitch: 0 });
  });

  it('should swap in the whole new style when picking another one', () => {
    const { container } = render(<VectorTilesTab />);

    fireEvent.click(container.querySelector('input[value="positron"]')!);

    expect(getMap().setStyle).toHaveBeenCalledWith('https://tiles.openfreemap.org/styles/positron', { diff: false });
  });

  it('should switch to the globe once the style has loaded', () => {
    const { container } = render(<VectorTilesTab />);
    emitMapEvent('style.load');

    fireEvent.click(container.querySelector('input[value="globe"]')!);

    expect(getMap().setProjection).toHaveBeenLastCalledWith({ type: 'globe' });
  });

  it('should wait for the style to load before switching to the globe', () => {
    const { container } = render(<VectorTilesTab />);

    fireEvent.click(container.querySelector('input[value="globe"]')!);

    expect(getMap().setProjection).not.toHaveBeenCalled();
  });

  it('should put the globe back when a new style loads', () => {
    const { container } = render(<VectorTilesTab />);
    emitMapEvent('style.load');
    fireEvent.click(container.querySelector('input[value="globe"]')!);
    fireEvent.click(container.querySelector('input[value="dark"]')!);
    getMap().setProjection.mockClear();

    emitMapEvent('style.load');

    expect(getMap().setProjection).toHaveBeenCalledWith({ type: 'globe' });
  });

  it('should show the zoom and say when the tiles are being drawn past their deepest level', () => {
    render(<VectorTilesTab />);

    emitMapEvent('zoom');

    expect(screen.getByText(/redrawn from level 14, still sharp/)).toBeInTheDocument();
  });

  it('should remove the map when the tab unmounts', () => {
    const { unmount } = render(<VectorTilesTab />);

    unmount();

    expect(getMap().remove).toHaveBeenCalled();
  });

  describe('directions', () => {
    it('should start with walking directions from Ramat Gan to Ra’anana', async () => {
      const expectedResult = [
        'https://routing.openstreetmap.de/routed-foot/route/v1/driving/34.8045,32.0836;34.871685,32.1845145?overview=full&geometries=geojson&alternatives=true',
      ];
      render(<VectorTilesTab />);

      await screen.findByText('16.5 km, 3 h 40 min');
      const actualResult = getRequestedUrls();

      expect(actualResult).toEqual(expectedResult);
    });

    it('should offer every route found to pick from', async () => {
      const expectedResult = 2;
      render(<VectorTilesTab />);

      await screen.findByText('16.5 km, 3 h 40 min');
      const actualResult = screen.getAllByRole('button', { name: /^Route \d$/ }).length;

      expect(actualResult).toBe(expectedResult);
    });

    it('should show the picked route', async () => {
      render(<VectorTilesTab />);
      await screen.findByText('16.5 km, 3 h 40 min');

      fireEvent.click(screen.getByRole('button', { name: 'Route 2' }));

      expect(screen.getByText('18.2 km, 3 h 59 min')).toBeInTheDocument();
    });

    it('should route by car when picking the car', async () => {
      render(<VectorTilesTab />);
      await screen.findByText('16.5 km, 3 h 40 min');

      fireEvent.click(screen.getByRole('button', { name: 'Car' }));

      expect(await screen.findByText('17.8 km, 17 min')).toBeInTheDocument();
    });

    it('should frame the routes once they arrive', async () => {
      const expectedResult = [
        [
          [34.8, 32.08],
          [34.87, 32.18],
        ],
        expect.objectContaining({ maxZoom: 16 }),
      ];
      render(<VectorTilesTab />);

      await screen.findByText('16.5 km, 3 h 40 min');
      const actualResult = getMap().fitBounds.mock.calls[0];

      expect(actualResult).toEqual(expectedResult);
    });

    it('should draw the routes on the map once its style loads', async () => {
      const expectedResult = [true, false];
      render(<VectorTilesTab />);
      await screen.findByText('16.5 km, 3 h 40 min');

      emitMapEvent('style.load');
      const { features } = getMap().routeData as { features: Array<{ properties: { selected: boolean } }> };
      const actualResult = features.map(({ properties }) => properties.selected);

      expect(actualResult).toEqual(expectedResult);
    });

    it('should pick a route by clicking its line', async () => {
      render(<VectorTilesTab />);
      await screen.findByText('16.5 km, 3 h 40 min');
      emitMapEvent('style.load');
      getMap().clickedRouteIndex = 1;

      emitMapEvent('click', { point: { x: 10, y: 10 }, lngLat: { lng: 0, lat: 0 }, originalEvent: { target: null } });

      expect(screen.getByText('18.2 km, 3 h 59 min')).toBeInTheDocument();
    });

    it('should move the destination to where the map is clicked', async () => {
      const expectedResult = [34.9, 32.2];
      render(<VectorTilesTab />);
      await screen.findByText('16.5 km, 3 h 40 min');

      emitMapEvent('click', {
        point: { x: 10, y: 10 },
        lngLat: { lng: 34.9, lat: 32.2 },
        originalEvent: { target: null },
      });
      const actualResult = getDestinationMarker().lngLat;

      expect(actualResult).toEqual(expectedResult);
    });

    it('should find a new route after dragging the start', async () => {
      render(<VectorTilesTab />);
      await screen.findByText('16.5 km, 3 h 40 min');
      const originMarker = getOriginMarker();

      act(() => {
        originMarker.setLngLat([34.78, 32.07]);
        originMarker.handlers.dragend!();
      });

      expect(getRequestedUrls().at(-1)).toContain('/34.78,32.07;34.871685,32.1845145?');
    });

    it('should start from the device location when asked', async () => {
      const getCurrentPosition = vi.fn((onSuccess: PositionCallback) =>
        onSuccess({ coords: { longitude: 34.85, latitude: 32.1 } } as GeolocationPosition),
      );
      vi.stubGlobal('navigator', { ...navigator, geolocation: { getCurrentPosition } });
      render(<VectorTilesTab />);
      await screen.findByText('16.5 km, 3 h 40 min');

      fireEvent.click(screen.getByRole('button', { name: 'From me' }));

      expect(getOriginMarker().lngLat).toEqual([34.85, 32.1]);
    });

    it('should say when no route connects the two points', async () => {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ code: 'NoRoute' }), { status: 400 }));
      render(<VectorTilesTab />);

      expect(await screen.findByText('No route found between these two points.')).toBeInTheDocument();
    });
  });
});
