import { useMemo, useRef, useState } from 'react';
import { geoIdentity, geoPath } from 'd3-geo';
import Button from '@src/components/controls/Button';
import { COUNTRY_RESOLUTIONS } from '../../../logic/data/loadCountries';
import { isBoundsInView } from '../../../logic/zoom/isBoundsInView';
import { pickResolution } from '../../../logic/zoom/pickResolution';
import { useCountriesAtResolution } from '../../../logic/zoom/useCountriesAtResolution';
import { MIN_ZOOM, useMapZoom } from '../../../logic/zoom/useMapZoom';
import {
  BASE_WORLD_SIZE,
  MAP_HEIGHT,
  MAP_WIDTH,
  MAX_TILE_ZOOM,
  MAX_ZOOM,
  PLACES,
  type Place,
} from '../logic/constants';
import { createTileAlignedProjection } from '../logic/createTileAlignedProjection';
import { formatDistance } from '../logic/formatDistance';
import { getMetersPerTilePixel } from '../logic/getMetersPerTilePixel';
import { getTileUrl } from '../logic/getTileUrl';
import { getTransformCenteredOn } from '../logic/getTransformCenteredOn';
import { getUnzoomedOutline } from '../logic/getUnzoomedOutline';
import { getVisibleTiles, placeTile, type TileAddress } from '../logic/getVisibleTiles';
import TileAttribution from './TileAttribution';

const OUTLINE_DIGITS = 1;
const ACCENT_COLOR = '#e11d48';

const ZOOM_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

type FlatTileMapProps = {
  showOutlines: boolean;
  showTileGrid: boolean;
};

export default function FlatTileMap(props: FlatTileMapProps) {
  const { showOutlines, showTileGrid } = props;

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
    <>
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

        <TileAttribution />
      </div>
    </>
  );
}
