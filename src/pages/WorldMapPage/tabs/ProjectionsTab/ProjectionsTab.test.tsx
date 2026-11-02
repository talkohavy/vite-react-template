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
});
