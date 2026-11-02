import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import SphereAndGraticuleTab from './SphereAndGraticuleTab';

describe('SphereAndGraticuleTab', () => {
  it('should draw the sphere, the graticule and the land as three SVG paths', () => {
    render(<SphereAndGraticuleTab />);

    const map = screen.getByRole('img', { name: 'Outline of the world land masses over a 10 degree graticule' });
    const pathCount = map.querySelectorAll('path[d^="M"]').length;

    expect(pathCount).toEqual(3);
  });
});
