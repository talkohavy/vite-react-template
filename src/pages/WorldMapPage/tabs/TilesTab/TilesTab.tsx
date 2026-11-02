import { useMemo, useRef, useState } from 'react';
import { geoIdentity, geoPath } from 'd3-geo';
import Button from '@src/components/controls/Button';
import Checkbox from '@src/components/controls/Checkbox';
import { COUNTRY_RESOLUTIONS } from '../../logic/data/loadCountries';
import { isBoundsInView } from '../../logic/zoom/isBoundsInView';
import { pickResolution } from '../../logic/zoom/pickResolution';
import { useCountriesAtResolution } from '../../logic/zoom/useCountriesAtResolution';
import { MIN_ZOOM, useMapZoom } from '../../logic/zoom/useMapZoom';
import {
  BASE_WORLD_SIZE,
  MAP_HEIGHT,
  MAP_WIDTH,
  MAX_TILE_ZOOM,
  PLACES,
  TILE_SIZE,
  type Place,
} from './logic/constants';
import { createTileAlignedProjection } from './logic/createTileAlignedProjection';
import { formatDistance } from './logic/formatDistance';
import { getMetersPerTilePixel } from './logic/getMetersPerTilePixel';
import { getTileUrl } from './logic/getTileUrl';
import { getTransformCenteredOn } from './logic/getTransformCenteredOn';
import { getUnzoomedOutline } from './logic/getUnzoomedOutline';
import { getVisibleTiles, placeTile, type TileAddress } from './logic/getVisibleTiles';

/**
 * Deep enough for OpenStreetMap's deepest tile level to be drawn at about its natural size.
 */
const MAX_ZOOM = 2 ** 17;

const OUTLINE_DIGITS = 1;
const ACCENT_COLOR = '#e11d48';

const ZOOM_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export default function TilesTab() {
  const [showOutlines, setShowOutlines] = useState(true);
  const [showTileGrid, setShowTileGrid] = useState(false);
  const [settledTiles, setSettledTiles] = useState<Array<TileAddress>>([]);
  const loadedTileKeysRef = useRef(new Set<string>());

  const { svgRef, transform, zoomIn, zoomOut, resetZoom, zoomTo } = useMapZoom({
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    contentHeight: BASE_WORLD_SIZE,
    maxZoom: MAX_ZOOM,
  });

  const { k } = transform;
  const isZoomedIn = k > MIN_ZOOM;
  const canZoomIn = k < MAX_ZOOM;

  const { tileZoom, tiles } = getVisibleTiles({
    transform,
    baseWorldSize: BASE_WORLD_SIZE,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  });

  const isLevelLoading = settledTiles.length > 0 && settledTiles[0]!.z !== tileZoom;
  const fallbackTiles = isLevelLoading
    ? settledTiles
        .map((tile) => placeTile({ tile, transform, baseWorldSize: BASE_WORLD_SIZE }))
        .filter(
          ({ left, top, width, height }) =>
            left + width > 0 && left < MAP_WIDTH && top + height > 0 && top < MAP_HEIGHT,
        )
    : [];

  const requestedResolution = pickResolution({ zoomLevel: k });
  const { countries, loadedResolution } = useCountriesAtResolution({ resolution: requestedResolution });

  const countryOutlines = useMemo(
    () => countries.map((country) => ({ name: country.properties.name, ...getUnzoomedOutline({ country }) })),
    [countries],
  );

  const zoomedPath = geoPath(
    geoIdentity()
      .scale(k)
      .translate([transform.x, transform.y])
      .clipExtent([
        [0, 0],
        [MAP_WIDTH, MAP_HEIGHT],
      ]),
  ).digits(OUTLINE_DIGITS);

  const outlines = showOutlines
    ? countryOutlines
        .filter(({ bounds }) => isBoundsInView({ bounds, transform, width: MAP_WIDTH, height: MAP_HEIGHT }))
        .map(({ name, outline }) => ({ name, path: zoomedPath(outline) }))
        .filter(({ path }) => path)
    : [];

  const projection = createTileAlignedProjection({ transform, baseWorldSize: BASE_WORLD_SIZE });
  const [, centerLatitude] = projection.invert!([MAP_WIDTH / 2, MAP_HEIGHT / 2])!;
  const metersPerTilePixel = getMetersPerTilePixel({ latitude: centerLatitude, tileZoom });

  function handleTileLoad(tileKey: string) {
    loadedTileKeysRef.current.add(tileKey);

    const isLevelLoaded = tiles.every(({ key }) => loadedTileKeysRef.current.has(key));

    if (isLevelLoaded) setSettledTiles(tiles.map(({ z, x, y }) => ({ z, x, y })));
  }

  function handlePlaceClick(place: Place) {
    const { longitude, latitude, tileZoom: placeTileZoom } = place;
    const placeTransform = getTransformCenteredOn({
      longitude,
      latitude,
      tileZoom: placeTileZoom,
      baseWorldSize: BASE_WORLD_SIZE,
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
    });

    zoomTo(placeTransform);
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        Every tab so far drew the world from vector data in the browser. This one shows pictures instead: OpenStreetMap
        has already drawn the whole world into 256×256 images, for every zoom level down to single buildings. The map
        only works out which images cover the view and places them. Drag to pan, Ctrl/⌘ + scroll or pinch to zoom.
      </p>

      <div className='flex flex-wrap items-center gap-3 text-sm'>
        <Button onClick={zoomIn} disabled={!canZoomIn} className='w-10'>
          +
        </Button>
        <Button onClick={zoomOut} disabled={!isZoomedIn} className='w-10'>
          −
        </Button>
        <Button onClick={resetZoom} disabled={!isZoomedIn}>
          Reset
        </Button>
        <span>Jump to:</span>
        {PLACES.map((place) => (
          <Button key={place.name} onClick={() => handlePlaceClick(place)}>
            {place.name}
          </Button>
        ))}
      </div>

      <div className='flex flex-wrap items-center gap-6 text-sm'>
        <Checkbox isChecked={showOutlines} setIsChecked={setShowOutlines} label='Country outlines' />
        <Checkbox isChecked={showTileGrid} setIsChecked={setShowTileGrid} label='Tile grid' />
      </div>

      <div className='text-sm tabular-nums'>
        Zoom <strong>{ZOOM_FORMAT.format(k)}×</strong> · Tile level <strong>{tileZoom}</strong> of {MAX_TILE_ZOOM} ·{' '}
        {tiles.length} tiles in view · 1 tile pixel ≈ <strong>{formatDistance({ meters: metersPerTilePixel })}</strong>
        {showOutlines && (
          <>
            {' '}
            · Outlines at <strong>{COUNTRY_RESOLUTIONS[loadedResolution].label}</strong>
          </>
        )}
      </div>

      <div className='relative'>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          role='img'
          aria-label='OpenStreetMap tiles in the Web Mercator projection'
          className='block w-full cursor-grab active:cursor-grabbing touch-none border border-gray-300 dark:border-gray-600 bg-[#aad3df]'
        >
          <g>
            {fallbackTiles.map(({ key, z, x, y, left, top, width, height }) => (
              <image key={key} href={getTileUrl({ z, x, y })} x={left} y={top} width={width} height={height} />
            ))}
          </g>
          <g>
            {tiles.map(({ key, z, x, y, left, top, width, height }) => (
              <image
                key={key}
                href={getTileUrl({ z, x, y })}
                x={left}
                y={top}
                width={width}
                height={height}
                onLoad={() => handleTileLoad(key)}
              />
            ))}
          </g>

          {showOutlines && (
            <g fill='none' stroke={ACCENT_COLOR} strokeWidth={1} pointerEvents='none'>
              {outlines.map(({ name, path }) => (
                <path key={name} d={path!} />
              ))}
            </g>
          )}

          {showTileGrid && (
            <g pointerEvents='none'>
              {tiles.map(({ key, left, top, width, height }) => (
                <g key={key}>
                  <rect x={left} y={top} width={width} height={height} fill='none' stroke='#111' strokeWidth={1} />
                  <text
                    x={left + 6}
                    y={top + 18}
                    fontSize={14}
                    fontFamily='monospace'
                    fill='#111'
                    stroke='#fff'
                    strokeWidth={3}
                    paintOrder='stroke'
                  >
                    {key}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>

        <div className='absolute bottom-px right-px px-1.5 py-0.5 text-[11px] bg-white/80 text-gray-800'>
          ©{' '}
          <a href='https://www.openstreetmap.org/copyright' target='_blank' rel='noreferrer' className='underline'>
            OpenStreetMap
          </a>{' '}
          contributors ·{' '}
          <a href='https://www.openstreetmap.org/fixthemap' target='_blank' rel='noreferrer' className='underline'>
            Report a map issue
          </a>
        </div>
      </div>

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
