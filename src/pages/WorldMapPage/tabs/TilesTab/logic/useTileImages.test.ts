import { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { useTileImages } from './useTileImages';
import type { GlobeTile } from './getGlobeVisibleTiles';

const TILE: GlobeTile = { z: 3, x: 4, y: 2, key: '3/4/2' };

function trackCreatedImages() {
  const createdImages: Array<HTMLImageElement> = [];
  vi.spyOn(window, 'Image').mockImplementation(function createImage() {
    const image = document.createElement('img');
    createdImages.push(image);

    return image;
  });

  return createdImages;
}

function finishLoading(images: Array<HTMLImageElement>) {
  act(() => {
    images.filter((image) => image.getAttribute('src')).forEach((image) => image.dispatchEvent(new Event('load')));
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTileImages', () => {
  it('should request each tile in view from OpenStreetMap', () => {
    const expectedResult = ['https://tile.openstreetmap.org/3/4/2.png'];
    const createdImages = trackCreatedImages();

    renderHook(() => useTileImages({ tiles: [TILE] }));
    const actualResult = createdImages.map((image) => image.getAttribute('src'));

    expect(actualResult).toEqual(expectedResult);
  });

  it('should fetch the tiles with CORS when recoloring their water, so their pixels can be read', () => {
    const createdImages = trackCreatedImages();

    renderHook(() => useTileImages({ tiles: [TILE], waterColor: 'blue' }));
    const actualResult = createdImages[0]!.crossOrigin;

    expect(actualResult).toBe('anonymous');
  });

  it('should still load the tiles after StrictMode unmounts and remounts it', () => {
    const createdImages = trackCreatedImages();
    const { result } = renderHook(() => useTileImages({ tiles: [TILE] }), { wrapper: StrictMode });

    finishLoading(createdImages);
    const actualResult = result.current.getTileImage(TILE);

    expect(actualResult).toMatchObject({ sourceX: 0, sourceY: 0, sourceSize: 256 });
  });

  it('should stretch a loaded ancestor over a tile that has not loaded yet', () => {
    const expectedResult = { sourceX: 0, sourceY: 128, sourceSize: 128 };
    const createdImages = trackCreatedImages();
    const parentTile: GlobeTile = { z: 2, x: 2, y: 1, key: '2/2/1' };
    const { result, rerender } = renderHook((props) => useTileImages(props), {
      initialProps: { tiles: [parentTile] },
    });
    finishLoading(createdImages);

    rerender({ tiles: [{ z: 3, x: 4, y: 3, key: '3/4/3' }] });
    const actualResult = result.current.getTileImage({ z: 3, x: 4, y: 3, key: '3/4/3' });

    expect(actualResult).toMatchObject(expectedResult);
  });

  it('should cancel tiles that leave the view before they load', () => {
    const createdImages = trackCreatedImages();
    const { rerender } = renderHook((props) => useTileImages(props), { initialProps: { tiles: [TILE] } });

    rerender({ tiles: [] });
    const actualResult = createdImages[0]!.getAttribute('src');

    expect(actualResult).toBe('');
  });
});
