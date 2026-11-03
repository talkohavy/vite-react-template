import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import ProjectionsTab from './ProjectionsTab';

describe('ProjectionsTab', () => {
  it('should start with the equirectangular projection', () => {
    render(<ProjectionsTab />);

    const map = screen.getByRole('img', { name: /Equirectangular projection/ });

    expect(map).toBeInTheDocument();
  });

  it('should redraw the same layers with the selected projection', () => {
    const { container } = render(<ProjectionsTab />);

    const equirectangularSpherePath = container.querySelector('svg path')!.getAttribute('d');

    fireEvent.click(container.querySelector('input[value="orthographic"]')!);

    const map = screen.getByRole('img', { name: /Orthographic projection/ });
    const orthographicSpherePath = map.querySelector('path')!.getAttribute('d');

    expect(orthographicSpherePath).not.toEqual(equirectangularSpherePath);
  });

  it('should spin the globe when dragging it', () => {
    const { container } = render(<ProjectionsTab />);
    fireEvent.click(container.querySelector('input[value="orthographic"]')!);
    const map = screen.getByRole('img', { name: /Orthographic projection/ });
    map.setPointerCapture = () => {};
    map.getBoundingClientRect = () => DOMRect.fromRect({ width: 960, height: 480 });
    const landPathBeforeDrag = map.querySelectorAll('path')[2]!.getAttribute('d');
    const dragOf30Degrees = (240 * Math.PI) / 6;

    fireEvent.pointerDown(map, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(map, { clientX: 100 + dragOf30Degrees, clientY: 100 - dragOf30Degrees, pointerId: 1 });
    fireEvent.pointerUp(map, { pointerId: 1 });

    expect(screen.getByText('30°S, 30°W')).toBeInTheDocument();
    expect(map.querySelectorAll('path')[2]!.getAttribute('d')).not.toEqual(landPathBeforeDrag);
  });

  it('should stop spinning once the pointer is released', () => {
    const { container } = render(<ProjectionsTab />);
    fireEvent.click(container.querySelector('input[value="orthographic"]')!);
    const map = screen.getByRole('img', { name: /Orthographic projection/ });
    map.setPointerCapture = () => {};
    map.getBoundingClientRect = () => DOMRect.fromRect({ width: 960, height: 480 });

    fireEvent.pointerDown(map, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(map, { pointerId: 1 });
    fireEvent.pointerMove(map, { clientX: 400, clientY: 100, pointerId: 1 });

    expect(screen.getByText('0°, 0°')).toBeInTheDocument();
  });

  it('should not spin the flat projections', () => {
    render(<ProjectionsTab />);
    const map = screen.getByRole('img', { name: /Equirectangular projection/ });
    const landPathBeforeDrag = map.querySelectorAll('path')[2]!.getAttribute('d');

    fireEvent.pointerDown(map, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(map, { clientX: 400, clientY: 100, pointerId: 1 });

    expect(map.querySelectorAll('path')[2]!.getAttribute('d')).toEqual(landPathBeforeDrag);
  });
});
