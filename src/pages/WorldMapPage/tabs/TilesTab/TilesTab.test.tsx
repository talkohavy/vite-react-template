import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import TilesTab from './TilesTab';

function getTileUrls() {
  const map = screen.getByRole('img', { name: /OpenStreetMap tiles/ });
  const urls = [...map.querySelectorAll('image')].map((image) => image.getAttribute('href'));

  return urls;
}

describe('TilesTab', () => {
  it('should start with the middle 8 tiles of tile level 2', () => {
    render(<TilesTab />);

    const tileUrls = getTileUrls();

    expect(tileUrls).toHaveLength(8);
    expect(tileUrls).toContain('https://tile.openstreetmap.org/2/0/1.png');
    expect(tileUrls).toContain('https://tile.openstreetmap.org/2/3/2.png');
  });

  it('should show the OpenStreetMap attribution', () => {
    render(<TilesTab />);

    expect(screen.getByRole('link', { name: 'OpenStreetMap' })).toHaveAttribute(
      'href',
      'https://www.openstreetmap.org/copyright',
    );
  });

  it('should load deeper tiles when jumping to a place', () => {
    render(<TilesTab />);

    fireEvent.click(screen.getByRole('button', { name: 'Eiffel Tower' }));

    expect(screen.getByText('17', { selector: 'strong' })).toBeInTheDocument();
    expect(getTileUrls()).toContain('https://tile.openstreetmap.org/17/66371/45091.png');
  });

  it('should label every tile with its address when the tile grid is on', () => {
    render(<TilesTab />);

    fireEvent.click(screen.getByText('Tile grid'));

    expect(screen.getByText('2/1/1')).toBeInTheDocument();
  });
});
