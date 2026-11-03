import { useState } from 'react';
import Checkbox from '@src/components/controls/Checkbox';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import FlatTileMap from './components/FlatTileMap';
import GlobeTileMap from './components/GlobeTileMap';
import { MAX_TILE_ZOOM, TILE_SIZE } from './logic/constants';
import { MIN_GLOBE_TILE_ZOOM } from './logic/getGlobeTileZoom';
import { MAX_CELL_ERROR, MAX_CELLS_PER_SIDE } from './logic/getTileCells';
import { MERCATOR_MAX_LATITUDE } from './logic/tileCoordinates';
import type { RadioOption } from '@src/components/controls/RadioButtons';

type TileView = 'flat' | 'globe';

const VIEW_OPTIONS: Array<RadioOption> = [
  { value: 'flat', label: 'Flat map' },
  { value: 'globe', label: 'Globe' },
];

export default function TilesTab() {
  const [view, setView] = useState<TileView>('flat');
  const [showOutlines, setShowOutlines] = useState(true);
  const [showTileGrid, setShowTileGrid] = useState(false);

  return (
    <div className='flex flex-col gap-4 w-full'>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        Every tab so far drew the world from vector data in the browser. This one shows pictures instead: OpenStreetMap
        has already drawn the whole world into 256×256 images, for every zoom level down to single buildings. The map
        only works out which images cover the view and places them. Drag to pan (or to spin the globe), Ctrl/⌘ + scroll
        or pinch to zoom.
      </p>

      <RadioTabs value={view} setValue={setView} options={VIEW_OPTIONS} className='flex flex-wrap gap-px w-full' />

      <div className='flex flex-wrap items-center gap-6 text-sm'>
        <Checkbox isChecked={showOutlines} setIsChecked={setShowOutlines} label='Country outlines' />
        <Checkbox isChecked={showTileGrid} setIsChecked={setShowTileGrid} label='Tile grid' />
      </div>

      {view === 'flat' ? (
        <FlatTileMap showOutlines={showOutlines} showTileGrid={showTileGrid} />
      ) : (
        <GlobeTileMap showOutlines={showOutlines} showTileGrid={showTileGrid} />
      )}

      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <h2 className='text-base font-bold text-gray-900 dark:text-white'>z/x/y</h2>
        <p>
          Tiles only come in Web Mercator. Its world is a square, cut off at 85.05° north and south, and at tile level{' '}
          <code>z</code> that square is split into 2<sup>z</sup> × 2<sup>z</sup> tiles. Level 0 is a single tile of the
          whole world; level {MAX_TILE_ZOOM} is 2<sup>{MAX_TILE_ZOOM}</sup> × 2<sup>{MAX_TILE_ZOOM}</sup>, about 275
          billion tiles. A tile&apos;s address is its level, then its column <code>x</code> counted from 180° west, then
          its row <code>y</code> counted from the top: <code>tile.openstreetmap.org/z/x/y.png</code>. Turn on the tile
          grid to see the addresses.
        </p>
        <p>
          <strong>Picking the level.</strong> At zoom <code>k</code> the world is 960 × <code>k</code> units wide, which
          is log<sub>2</sub>(960<code>k</code> / {TILE_SIZE}) tile levels. Rounding that to the nearest level means a
          tile is drawn between 71% and 141% of its natural {TILE_SIZE} units. At 1× that&apos;s level 2, with tiles 240
          units wide. Each step down a level brings in tiles with twice the detail, and only the ones in view are
          downloaded.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Why Mercator</h2>
        <p>
          Mercator keeps angles and local shapes true, so streets cross at the right angles at every zoom level, and its
          square world splits evenly into square tiles. The price is the one from step 3: area. Greenland is as huge
          here as it was there.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Lining up the outlines</h2>
        <p>
          The country outlines are the same world-atlas data as before, drawn on top with d3&apos;s{' '}
          <code>geoMercator</code>. For them to land on the tiles, the projection&apos;s scale is the world&apos;s width
          over 2π, and its center is wherever the zoom has moved the middle of the world.
        </p>
        <p>
          Zoom in and they drift apart. The outlines run out of detail at 1:10m, with a point every 2.6 km, while the
          tiles keep going: at level {MAX_TILE_ZOOM}, a tile pixel covers about 30 cm at the equator.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Wrapping tiles around a globe</h2>
        <p>
          The tiles are flat Mercator pictures, so on the globe each one has to be bent. A canvas can only stretch an
          image with an affine transform, which turns a square into a parallelogram, and a tile on a globe is curved,
          narrower at its polar edge, and squeezed near the rim. So each tile is cut into four, again and again, until
          every piece&apos;s corners and middle land within {MAX_CELL_ERROR} units of where the projection puts them,
          and each piece is drawn as its own parallelogram, at most {MAX_CELLS_PER_SIDE} × {MAX_CELLS_PER_SIDE} per
          tile. Unzoomed, that&apos;s about 1,100 pieces from 48 tiles. The pieces overlap by {MAX_CELL_ERROR} units, so
          no hairline gaps open between neighbours that don&apos;t quite meet.
        </p>
        <p>
          <strong>Picking the level on a globe.</strong> Mercator stretches the world by 1 / cos(latitude), so far north
          a tile covers less ground and looks smaller on the globe. The level is picked from the globe&apos;s size at
          the latitude facing you, so the tiles in the middle of the view stay near their natural size. At 1000×,
          that&apos;s level 13 over the equator but level 11 at 70° north. It never goes below level{' '}
          {MIN_GLOBE_TILE_ZOOM}, whose tiles are already 45° wide.
        </p>
        <p>
          <strong>Which tiles to fetch.</strong> Each tile&apos;s longitude/latitude box gets a bounding circle, the
          same trick as for the countries in the Zoom tab, and only tiles whose circle reaches the visible part of the
          globe are requested. Mercator stops at {MERCATOR_MAX_LATITUDE.toFixed(2)}°, so there are no tiles for the
          poles: they&apos;re the two gray caps. The outlines and the tile grid are drawn by d3 on top, with the same
          rotated <code>geoOrthographic</code>.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Being a good tile citizen</h2>
        <p>
          OpenStreetMap&apos;s tile servers are run on donations, and their{' '}
          <a
            href='https://operations.osmfoundation.org/policies/tiles/'
            target='_blank'
            rel='noreferrer'
            className='underline'
          >
            usage policy
          </a>{' '}
          asks for a visible attribution on the map, and for requesting only the tiles someone is looking at: no
          prefetching, no downloading areas for later. That&apos;s fine for a demo like this one. A real app should use
          a tile provider or host its own.
        </p>
      </div>
    </div>
  );
}
