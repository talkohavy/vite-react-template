import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import VectorTilesTab from './VectorTilesTab';

const { createdMaps } = vi.hoisted(() => ({ createdMaps: [] as Array<FakeMap> }));

type FakeMap = {
  options: { style: string; center: [number, number]; zoom: number };
  handlers: Record<string, () => void>;
  on: (eventName: string, handler: () => void) => void;
  addControl: ReturnType<typeof vi.fn>;
  setStyle: ReturnType<typeof vi.fn>;
  setProjection: ReturnType<typeof vi.fn>;
  flyTo: ReturnType<typeof vi.fn>;
  getZoom: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

vi.mock('maplibre-gl', () => {
  function Map(this: FakeMap, options: FakeMap['options']) {
    this.options = options;
    this.handlers = {};
    this.addControl = vi.fn();
    this.setStyle = vi.fn();
    this.setProjection = vi.fn();
    this.flyTo = vi.fn();
    this.getZoom = vi.fn(() => 15.4);
    this.remove = vi.fn();
    this.on = (eventName, handler) => {
      this.handlers[eventName] = handler;
    };
    createdMaps.push(this);
  }

  function NavigationControl() {}

  return { Map, NavigationControl, setWorkerUrl: vi.fn() };
});

function getMap() {
  return createdMaps.at(-1)!;
}

function emitMapEvent(eventName: string) {
  act(() => {
    getMap().handlers[eventName]!();
  });
}

beforeEach(() => {
  createdMaps.length = 0;
});

describe('VectorTilesTab', () => {
  it('should start the map on the Liberty style, zoomed out on the world', () => {
    const expectedResult = { style: 'https://tiles.openfreemap.org/styles/liberty', center: [0, 20], zoom: 1 };
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
});
