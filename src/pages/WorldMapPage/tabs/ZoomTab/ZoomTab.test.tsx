import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import ZoomTab from './ZoomTab';

const DRAG_OF_30_DEGREES_AT_1X = (240 * Math.PI) / 6;

function renderGlobe() {
  const { container } = render(<ZoomTab />);
  fireEvent.click(container.querySelector('input[value="orthographic"]')!);

  const map = screen.getByRole('img', { name: /Zoomable world countries in the Orthographic projection/ });
  map.setPointerCapture = () => {};
  map.getBoundingClientRect = () => DOMRect.fromRect({ width: 960, height: 480 });

  return map;
}

function drag(target: Element, deltaX: number, deltaY: number) {
  fireEvent.pointerDown(target, { clientX: 100, clientY: 100, pointerId: 1 });
  fireEvent.pointerMove(target, { clientX: 100 + deltaX, clientY: 100 + deltaY, pointerId: 1 });
  fireEvent.pointerUp(target, { pointerId: 1 });
}

describe('ZoomTab', () => {
  it('should start at 1x with the 1:110m countries', () => {
    render(<ZoomTab />);

    expect(screen.getByText('1.0×')).toBeInTheDocument();
  });

  it('should double the zoom level when zooming in with the button', () => {
    render(<ZoomTab />);

    fireEvent.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getByText('2.0×')).toBeInTheDocument();
  });

  it('should switch to the 1:50m countries once zoomed in past 3x', async () => {
    render(<ZoomTab />);

    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));

    const detail = await screen.findByText('1:50m', { selector: 'strong' });

    expect(detail).toBeInTheDocument();
  });

  it('should still select a country by clicking it', () => {
    render(<ZoomTab />);

    const map = screen.getByRole('img', { name: /Zoomable world countries/ });
    fireEvent.click(map.querySelector('path[data-name="France"]')!);

    expect(screen.getByText(/properties: \{ name: "France" \}/)).toBeInTheDocument();
  });

  it('should spin the globe when dragging it', () => {
    const map = renderGlobe();

    drag(map, DRAG_OF_30_DEGREES_AT_1X, -DRAG_OF_30_DEGREES_AT_1X);

    expect(screen.getByText('30°S, 30°W')).toBeInTheDocument();
  });

  it('should spin the globe less for the same drag when zoomed in', () => {
    const map = renderGlobe();
    fireEvent.click(screen.getByRole('button', { name: '+' }));

    drag(map, DRAG_OF_30_DEGREES_AT_1X, 0);

    expect(screen.getByText('0°, 15°W')).toBeInTheDocument();
  });

  it('should zoom the globe around the middle of the view', () => {
    const expectedResult = 'translate(-480 -240) scale(2)';
    const map = renderGlobe();

    fireEvent.click(screen.getByRole('button', { name: '+' }));
    const actualResult = map.querySelector('g')!.getAttribute('transform');

    expect(actualResult).toBe(expectedResult);
  });

  it('should not select a country at the end of a drag', () => {
    const map = renderGlobe();
    const france = map.querySelector('path[data-name="France"]')!;

    drag(france, 50, 0);
    fireEvent.click(france);

    expect(screen.queryByText(/properties: \{ name: "France" \}/)).not.toBeInTheDocument();
  });
});
