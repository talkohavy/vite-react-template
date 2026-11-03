import { useEffect, useRef, useState } from 'react';
import { TILE_SIZE } from './constants';
import { getTileUrl } from './getTileUrl';
import { recolorWater } from './recolorWater';
import type { GlobeTile } from './getGlobeVisibleTiles';

/**
 * How many levels up to look for a loaded tile to stretch over one that hasn't loaded yet.
 */
const MAX_FALLBACK_LEVELS = 6;

const MAX_CACHED_IMAGES = 500;

export type TileImageSource = {
  image: CanvasImageSource;
  /**
   * The square of the image that covers the tile, in image pixels. The whole image unless it's an ancestor tile.
   */
  sourceX: number;
  sourceY: number;
  sourceSize: number;
};

type TileImageEntry = {
  image: HTMLImageElement;
  /**
   * What gets drawn: the image itself, or a recolored copy of it.
   */
  drawable: CanvasImageSource;
  isLoaded: boolean;
};

type CancelPendingLoadsProps = {
  cache: Map<string, TileImageEntry>;
  keysToKeep: Set<string>;
};

/**
 * Cancelled tiles are dropped from the cache too, so they're requested again if they come back into view.
 */
function cancelPendingLoads(props: CancelPendingLoadsProps) {
  const { cache, keysToKeep } = props;

  cache.forEach((entry, key) => {
    if (entry.isLoaded || keysToKeep.has(key)) return;

    entry.image.onload = null;
    entry.image.src = '';
    cache.delete(key);
  });
}

type UseTileImagesProps = {
  tiles: Array<GlobeTile>;
  /**
   * Repaints the tiles' water in this CSS color once they load. Leave it out to keep OpenStreetMap's colors.
   */
  waterColor?: string;
};

/**
 * Loads the tiles in view, and cancels the ones that leave the view before they've loaded.
 */
export function useTileImages(props: UseTileImagesProps) {
  const { tiles, waterColor } = props;

  const cacheRef = useRef(new Map<string, TileImageEntry>());
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const cache = cacheRef.current;
    const wantedKeys = new Set(tiles.map(({ key }) => key));

    cancelPendingLoads({ cache, keysToKeep: wantedKeys });

    tiles.forEach((tile) => {
      const cachedEntry = cache.get(tile.key);

      if (cachedEntry) {
        cache.delete(tile.key);
        cache.set(tile.key, cachedEntry);

        return;
      }

      const image = new Image();
      const entry: TileImageEntry = { image, drawable: image, isLoaded: false };
      image.onload = () => {
        if (waterColor) entry.drawable = recolorWater({ image, waterColor });
        entry.isLoaded = true;
        setLoadedCount((prevLoadedCount) => prevLoadedCount + 1);
      };
      // Reading a cross-origin image's pixels needs it fetched with CORS, which tile.openstreetmap.org allows.
      if (waterColor) image.crossOrigin = 'anonymous';
      image.src = getTileUrl(tile);
      cache.set(tile.key, entry);
    });

    const evictableKeys = [...cache.keys()].filter((key) => !wantedKeys.has(key));
    evictableKeys.slice(0, Math.max(0, cache.size - MAX_CACHED_IMAGES)).forEach((key) => cache.delete(key));
  }, [tiles, waterColor]);

  useEffect(() => {
    const cache = cacheRef.current;

    return () => {
      cancelPendingLoads({ cache, keysToKeep: new Set() });
    };
  }, []);

  function getTileImage(tile: GlobeTile): TileImageSource | null {
    const { z, x, y } = tile;

    for (let levelsUp = 0; levelsUp <= Math.min(z, MAX_FALLBACK_LEVELS); levelsUp++) {
      const tilesPerAncestor = 2 ** levelsUp;
      const ancestorX = Math.floor(x / tilesPerAncestor);
      const ancestorY = Math.floor(y / tilesPerAncestor);
      const entry = cacheRef.current.get(`${z - levelsUp}/${ancestorX}/${ancestorY}`);

      if (entry?.isLoaded) {
        const sourceSize = TILE_SIZE / tilesPerAncestor;
        const tileImageSource = {
          image: entry.drawable,
          sourceX: (x - ancestorX * tilesPerAncestor) * sourceSize,
          sourceY: (y - ancestorY * tilesPerAncestor) * sourceSize,
          sourceSize,
        };

        return tileImageSource;
      }
    }

    return null;
  }

  return { getTileImage, loadedCount };
}
