import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import TilesTab from './TilesTab';

function renderGlobe() {
  const { container } = render(<TilesTab />);
  fireEvent.click(container.querySelector('input[value="globe"]')!);

  const map = screen.getByRole('img', { name: /OpenStreetMap tiles wrapped around an Orthographic globe/ });
  map.setPointerCapture = () => {};
  map.getBoundingClientRect = () => DOMRect.fromRect({ width: 960, height: 480 });

  return map;
}

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

  describe('globe', () => {
    beforeEach(() => {
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    });

    it('should start with the tile level 3 tiles facing the viewer', () => {
      renderGlobe();

      expect(screen.getByText('3', { selector: 'strong' })).toBeInTheDocument();
      expect(screen.getByText(/48 tiles in view/)).toBeInTheDocument();
    });

    it('should label the tiles in view when the tile grid is on', () => {
      renderGlobe();

      fireEvent.click(screen.getByText('Tile grid'));

      expect(screen.getByText('3/4/4')).toBeInTheDocument();
      expect(screen.queryByText('3/0/4')).not.toBeInTheDocument();
    });

    it('should spin the globe when dragging it', () => {
      const map = renderGlobe();
      const dragOf30Degrees = (240 * Math.PI) / 6;

      fireEvent.pointerDown(map, { clientX: 100, clientY: 100, pointerId: 1 });
      fireEvent.pointerMove(map, { clientX: 100 + dragOf30Degrees, clientY: 100, pointerId: 1 });
      fireEvent.pointerUp(map, { pointerId: 1 });

      expect(screen.getByText('0°, 30°W')).toBeInTheDocument();
    });

    it('should turn to a place and zoom to its tile level when jumping to it', () => {
      renderGlobe();

      fireEvent.click(screen.getByRole('button', { name: 'Eiffel Tower' }));

      expect(screen.getByText('49°N, 2°E')).toBeInTheDocument();
      expect(screen.getByText('17', { selector: 'strong' })).toBeInTheDocument();
    });

    it('should show the OpenStreetMap attribution', () => {
      renderGlobe();

      expect(screen.getByRole('link', { name: 'OpenStreetMap' })).toBeInTheDocument();
    });
  });
});
