import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import BareMapTab from './BareMapTab';

describe('BareMapTab', () => {
  it('should draw the land outline as a single SVG path', () => {
    render(<BareMapTab />);

    const map = screen.getByRole('img', { name: 'Outline of the world land masses' });
    const paths = map.querySelectorAll('path');

    expect(paths).toHaveLength(1);
    expect(paths[0]!.getAttribute('d')).toMatch(/^M/);
  });
});
