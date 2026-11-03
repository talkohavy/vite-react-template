import { useEffect, useRef } from 'react';
import { geoDistance, geoOrthographic, geoPath, type GeoSphere } from 'd3-geo';
import Button from '@src/components/controls/Button';
import { COUNTRY_RESOLUTIONS } from '../../../logic/data/loadCountries';
import { formatFacingPoint } from '../../../logic/globe/formatFacingPoint';
import { getFacingGeometry } from '../../../logic/globe/getFacingGeometry';
import { getVisibleCapRadius } from '../../../logic/globe/getVisibleCapRadius';
import { useGlobeDrag } from '../../../logic/globe/useGlobeDrag';
import { getCenteredTransform } from '../../../logic/zoom/getCenteredTransform';
import { pickResolution } from '../../../logic/zoom/pickResolution';
import { useCountriesAtResolution } from '../../../logic/zoom/useCountriesAtResolution';
import { MIN_ZOOM, useMapZoom } from '../../../logic/zoom/useMapZoom';
import { GLOBE_RADIUS, MAP_HEIGHT, MAP_WIDTH, MAX_TILE_ZOOM, MAX_ZOOM, PLACES, type Place } from '../logic/constants';
import { drawGlobeTiles } from '../logic/drawGlobeTiles';
import { formatDistance } from '../logic/formatDistance';
import { getGlobeTileZoom, getGlobeZoomForTileZoom } from '../logic/getGlobeTileZoom';
import { getGlobeVisibleTiles, type GlobeTile } from '../logic/getGlobeVisibleTiles';
import { getMetersPerTilePixel } from '../logic/getMetersPerTilePixel';
import { tileToLonLat } from '../logic/tileCoordinates';
import { useTileImages } from '../logic/useTileImages';
import TileAttribution from './TileAttribution';

const SPHERE: GeoSphere = { type: 'Sphere' };
const DEGREES_PER_RADIAN = 180 / Math.PI;
const MAP_CENTER: [number, number] = [MAP_WIDTH / 2, MAP_HEIGHT / 2];
const TILE_GRID_POINTS_PER_EDGE = 16;

/**
 * d3's circle clipping loses precision on caps much smaller than this, so very deep zooms clip a little wider than
 * the view.
 */
const MIN_CLIP_ANGLE = 0.1;

const OUTLINE_DIGITS = 1;
const ACCENT_COLOR = '#e11d48';

const ZOOM_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

type GetTileOutlineProps = {
  tile: GlobeTile;
  pointsPerEdge: number;
};

/**
 * A tile's top and bottom edges are parallels, which aren't straight on a globe, so they need points in between.
 */
function getTileOutline(props: GetTileOutlineProps): GeoJSON.LineString {
  const { tile, pointsPerEdge } = props;
  const { z, x, y } = tile;

  const fractions = Array.from({ length: pointsPerEdge + 1 }, (_, index) => index / pointsPerEdge);
  const topEdge = fractions.map((fraction) => tileToLonLat({ x: x + fraction, y, z }));
  const bottomEdge = fractions.map((fraction) => tileToLonLat({ x: x + 1 - fraction, y: y + 1, z }));

  const tileOutline: GeoJSON.LineString = { type: 'LineString', coordinates: [...topEdge, ...bottomEdge, topEdge[0]!] };

  return tileOutline;
}

type GlobeTileMapProps = {
  showOutlines: boolean;
  showTileGrid: boolean;
};

export default function GlobeTileMap(props: GlobeTileMapProps) {
  const { showOutlines, showTileGrid } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { svgRef, transform, zoomIn, zoomOut, resetZoom, zoomTo } = useMapZoom({
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    maxZoom: MAX_ZOOM,
    isPanEnabled: false,
  });

  const { k } = transform;
  const isZoomedIn = k > MIN_ZOOM;
  const canZoomIn = k < MAX_ZOOM;
  const radiusOnScreen = GLOBE_RADIUS * k;

  const { rotation, isRotated, rotateTo, resetRotation, dragHandlers } = useGlobeDrag({
    isEnabled: true,
    mapWidth: MAP_WIDTH,
    radius: radiusOnScreen,
  });

  const facingPoint: [number, number] = [-rotation[0], -rotation[1]];
  const capRadius = getVisibleCapRadius({ radius: GLOBE_RADIUS, zoomLevel: k, width: MAP_WIDTH, height: MAP_HEIGHT });

  const tileZoom = getGlobeTileZoom({ radiusOnScreen, latitude: facingPoint[1] });
  const tiles = getGlobeVisibleTiles({ facingPoint, capRadius, tileZoom });
  const { getTileImage } = useTileImages({ tiles });

  const projection = geoOrthographic()
    .scale(radiusOnScreen)
    .translate(MAP_CENTER)
    .rotate(rotation)
    .clipAngle(Math.max(MIN_CLIP_ANGLE, capRadius * DEGREES_PER_RADIAN));
  const svgPath = geoPath(projection).digits(OUTLINE_DIGITS);
  const spherePath = svgPath(SPHERE) ?? '';

  const pixelRatio = Math.min(2, window.devicePixelRatio || 1);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context) return;

    drawGlobeTiles({
      context,
      tiles,
      getTileImage,
      projection,
      rotation,
      radiusOnScreen,
      center: MAP_CENTER,
      pixelRatio,
    });
  });

  const requestedResolution = pickResolution({ zoomLevel: k });
  const { countries, loadedResolution } = useCountriesAtResolution({ resolution: requestedResolution });

  const outlines = showOutlines
    ? countries
        .map((country) => {
          const facingGeometry = getFacingGeometry({ country, facingPoint, capRadius });

          return { name: country.properties.name, path: facingGeometry && svgPath(facingGeometry) };
        })
        .filter(({ path }) => path)
    : [];

  const tileGrid = showTileGrid
    ? tiles.map((tile) => {
        const centerLonLat = tileToLonLat({ x: tile.x + 0.5, y: tile.y + 0.5, z: tileZoom });
        const [labelX, labelY] = projection(centerLonLat)!;
        const isLabelInView =
          geoDistance(facingPoint, centerLonLat) < Math.PI / 2 &&
          labelX >= 0 &&
          labelX <= MAP_WIDTH &&
          labelY >= 0 &&
          labelY <= MAP_HEIGHT;

        return {
          key: tile.key,
          path: svgPath(getTileOutline({ tile, pointsPerEdge: TILE_GRID_POINTS_PER_EDGE })),
          label: isLabelInView ? { x: labelX, y: labelY } : null,
        };
      })
    : [];

  const metersPerTilePixel = getMetersPerTilePixel({ latitude: facingPoint[1], tileZoom });

  function handleReset() {
    resetZoom();
    resetRotation();
  }

  function handlePlaceClick(place: Place) {
    const { longitude, latitude, tileZoom: placeTileZoom } = place;
    const zoomLevel = getGlobeZoomForTileZoom({ tileZoom: placeTileZoom, latitude });

    rotateTo([-longitude, -latitude]);
    zoomTo(getCenteredTransform({ zoomLevel, width: MAP_WIDTH, height: MAP_HEIGHT }));
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
        <Button onClick={handleReset} disabled={!isZoomedIn && !isRotated}>
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
        Zoom <strong>{ZOOM_FORMAT.format(k)}×</strong> · Facing <strong>{formatFacingPoint({ rotation })}</strong> ·
        Tile level <strong>{tileZoom}</strong> of {MAX_TILE_ZOOM} · {tiles.length} tiles in view · 1 tile pixel ≈{' '}
        <strong>{formatDistance({ meters: metersPerTilePixel })}</strong>
        {showOutlines && (
          <>
            {' '}
            · Outlines at <strong>{COUNTRY_RESOLUTIONS[loadedResolution].label}</strong>
          </>
        )}
      </div>

      <div className='relative border border-gray-300 dark:border-gray-600'>
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH * pixelRatio}
          height={MAP_HEIGHT * pixelRatio}
          aria-hidden
          className='block w-full h-auto'
        />
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          role='img'
          aria-label='OpenStreetMap tiles wrapped around an Orthographic globe'
          className='absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none select-none'
          {...dragHandlers}
        >
          <path d={spherePath} fill='none' stroke='currentColor' strokeWidth={1.5} />

          {showOutlines && (
            <g fill='none' stroke={ACCENT_COLOR} strokeWidth={1} pointerEvents='none'>
              {outlines.map(({ name, path }) => (
                <path key={name} d={path!} />
              ))}
            </g>
          )}

          {showTileGrid && (
            <g pointerEvents='none'>
              {tileGrid.map(({ key, path, label }) => (
                <g key={key}>
                  {path && <path d={path} fill='none' stroke='#111' strokeWidth={1} />}
                  {label && (
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor='middle'
                      dominantBaseline='middle'
                      fontSize={14}
                      fontFamily='monospace'
                      fill='#111'
                      stroke='#fff'
                      strokeWidth={3}
                      paintOrder='stroke'
                    >
                      {key}
                    </text>
                  )}
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
