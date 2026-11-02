import { useMemo, useState, type MouseEvent, type PointerEvent } from 'react';
import clsx from 'clsx';
import { geoGraticule10, geoPath, type GeoSphere } from 'd3-geo';
import Button from '@src/components/controls/Button';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { COUNTRY_RESOLUTIONS, type CountryResolution } from '../../logic/data/loadCountries';
import { PROJECTION_OPTIONS, PROJECTIONS, type ProjectionName } from '../../logic/projections';
import { fitProjectionToSphere } from '../../logic/utils/fitProjectionToSphere';
import { getCountryNameFromTarget } from '../../logic/utils/getCountryNameFromTarget';
import { getNextSelectedName } from '../../logic/utils/getNextSelectedName';
import { summarizeCountryFeature } from '../../logic/utils/summarizeCountryFeature';
import { isBoundsInView } from '../../logic/zoom/isBoundsInView';
import { pickResolution } from '../../logic/zoom/pickResolution';
import { useCountriesAtResolution } from '../../logic/zoom/useCountriesAtResolution';
import { MAX_ZOOM, MIN_ZOOM, useMapZoom } from '../../logic/zoom/useMapZoom';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;

/**
 * geoPath's default of 3 decimals is a whole pixel of error at 1000x zoom.
 */
const PATH_DIGITS = 4;

const SPHERE: GeoSphere = { type: 'Sphere' };
const GRATICULE = geoGraticule10();

const ACCENT_COLOR = '#e11d48';

const RESOLUTIONS = Object.entries(COUNTRY_RESOLUTIONS) as Array<
  [CountryResolution, (typeof COUNTRY_RESOLUTIONS)[CountryResolution]]
>;

export default function ZoomTab() {
  const [projectionName, setProjectionName] = useState<ProjectionName>('equirectangular');
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const { svgRef, transform, zoomIn, zoomOut, resetZoom } = useMapZoom({ width: MAP_WIDTH, height: MAP_HEIGHT });

  const requestedResolution = pickResolution({ zoomLevel: transform.k });
  const { countries, loadedResolution, isLoading } = useCountriesAtResolution({ resolution: requestedResolution });

  const { createProjection, label } = PROJECTIONS[projectionName];

  const pathGenerator = useMemo(() => {
    const projection = fitProjectionToSphere({ createProjection, width: MAP_WIDTH, height: MAP_HEIGHT });

    return geoPath(projection).digits(PATH_DIGITS);
  }, [createProjection]);

  const spherePath = pathGenerator(SPHERE) ?? '';
  const graticulePath = pathGenerator(GRATICULE) ?? '';

  const countryShapes = useMemo(
    () =>
      countries
        .map((country) => ({
          name: country.properties.name,
          path: pathGenerator(country),
          bounds: pathGenerator.bounds(country),
        }))
        .filter(({ path }) => path),
    [countries, pathGenerator],
  );

  const visibleShapes = countryShapes.filter(({ bounds }) =>
    isBoundsInView({ bounds, transform, width: MAP_WIDTH, height: MAP_HEIGHT }),
  );

  const hoveredPath = countryShapes.find(({ name }) => name === hoveredName)?.path;
  const selectedPath = countryShapes.find(({ name }) => name === selectedName)?.path;

  const selectedCountry = countries.find((country) => country.properties.name === selectedName);
  const selectedSummary = selectedCountry ? summarizeCountryFeature({ feature: selectedCountry }) : null;

  const { k, x, y } = transform;
  const isZoomedIn = k > MIN_ZOOM;
  const canZoomIn = k < MAX_ZOOM;

  function handleProjectionChange(nextProjectionName: ProjectionName) {
    setProjectionName(nextProjectionName);
    resetZoom();
  }

  function handlePointerOver(event: PointerEvent<SVGSVGElement>) {
    const countryName = getCountryNameFromTarget({ target: event.target });
    setHoveredName(countryName);
  }

  function handlePointerLeave() {
    setHoveredName(null);
  }

  function handleClick(event: MouseEvent<SVGSVGElement>) {
    const clickedName = getCountryNameFromTarget({ target: event.target });
    setSelectedName((prevSelectedName) => getNextSelectedName({ selectedName: prevSelectedName, clickedName }));
  }

  return (
    <div className='flex flex-col gap-4 w-full max-w-5xl'>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        The interactive countries from the previous tab, now zoomable up to {MAX_ZOOM}×. Drag to pan, Ctrl/⌘ + scroll or
        pinch to zoom, or use the buttons. Hover and click still work at any zoom level.
      </p>

      <RadioTabs
        value={projectionName}
        setValue={handleProjectionChange}
        options={PROJECTION_OPTIONS}
        className='flex flex-wrap gap-px w-full'
      />

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

        <span className='tabular-nums'>
          Zoom <strong>{k.toFixed(1)}×</strong> · Detail <strong>{COUNTRY_RESOLUTIONS[loadedResolution].label}</strong>
          {isLoading && ` (loading ${COUNTRY_RESOLUTIONS[requestedResolution].label}…)`} · Drawing{' '}
          {visibleShapes.length} of {countryShapes.length} countries
        </span>
      </div>

      <div className='text-sm'>
        Hovering: <strong>{hoveredName ?? '—'}</strong>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role='img'
        aria-label={`Zoomable world countries in the ${label} projection`}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className='cursor-grab active:cursor-grabbing touch-none border border-gray-300 dark:border-gray-600'
      >
        <g transform={`translate(${x} ${y}) scale(${k})`}>
          <path d={spherePath} fill='none' stroke='currentColor' strokeWidth={1.5} vectorEffect='non-scaling-stroke' />
          <path
            d={graticulePath}
            fill='none'
            stroke='currentColor'
            strokeWidth={0.5}
            strokeOpacity={0.25}
            vectorEffect='non-scaling-stroke'
          />
          {visibleShapes.map(({ name, path }) => (
            <path
              key={name}
              data-name={name}
              d={path!}
              fill='transparent'
              stroke='currentColor'
              strokeWidth={0.75}
              vectorEffect='non-scaling-stroke'
            />
          ))}

          <g pointerEvents='none'>
            {hoveredPath && hoveredName !== selectedName && (
              <path
                d={hoveredPath}
                fill={ACCENT_COLOR}
                fillOpacity={0.25}
                stroke={ACCENT_COLOR}
                strokeWidth={1}
                vectorEffect='non-scaling-stroke'
              />
            )}
            {selectedPath && (
              <path
                d={selectedPath}
                fill={ACCENT_COLOR}
                fillOpacity={0.6}
                stroke={ACCENT_COLOR}
                strokeWidth={1.5}
                vectorEffect='non-scaling-stroke'
              />
            )}
          </g>
        </g>
      </svg>

      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        {selectedSummary ? (
          <>
            <div>
              Selected: <strong>{selectedName}</strong> (at {COUNTRY_RESOLUTIONS[loadedResolution].label} detail)
            </div>
            <pre className='font-mono text-xs p-3 rounded-md bg-gray-100 dark:bg-gray-800 overflow-auto'>
              {selectedSummary}
            </pre>
          </>
        ) : (
          <div>Click a country to select it. Its position count grows as you zoom in and more detail loads.</div>
        )}

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Zooming without redrawing</h2>
        <p>
          <code>d3-zoom</code> turns drags, scrolls and pinches into a transform: a scale <code>k</code> and a
          translation <code>x</code>, <code>y</code>. It&apos;s applied as a single SVG <code>transform</code> on a
          group that wraps every layer, so zooming and panning don&apos;t recompute any paths. Strokes would scale along
          with everything else (a 0.75px border would be 75px wide at 100×), so every path uses{' '}
          <code>vector-effect=&quot;non-scaling-stroke&quot;</code> to keep its line width on screen.
        </p>
        <p>
          Double-click zoom is turned off because clicks select countries. A drag doesn&apos;t count as a click, so
          panning never changes the selection.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>More detail as you zoom in</h2>
        <p>
          The 1:110m countries have a point every 73 km on average. Zoom in and those straight segments show. So the map
          switches to more detailed Natural Earth data as you go, chosen to keep the average segment around 5 pixels
          long (measured at the equator, in equirectangular). The bigger files are only downloaded the first time you
          zoom past their threshold.
        </p>

        <table className='text-left tabular-nums w-fit'>
          <thead>
            <tr className='border-b border-gray-300 dark:border-gray-600'>
              <th className='pr-6 py-1'>Detail</th>
              <th className='pr-6 py-1'>Used from</th>
              <th className='pr-6 py-1'>File size</th>
              <th className='pr-6 py-1'>Positions</th>
              <th className='py-1'>Avg. segment</th>
            </tr>
          </thead>
          <tbody>
            {RESOLUTIONS.map(([resolution, info]) => (
              <tr key={resolution} className={clsx(resolution === loadedResolution && 'font-bold')}>
                <td className='pr-6 py-1'>{info.label}</td>
                <td className='pr-6 py-1'>{info.minZoom}×</td>
                <td className='pr-6 py-1'>{info.fileSizeKb.toLocaleString('en-US')} KB</td>
                <td className='pr-6 py-1'>{info.positionCount.toLocaleString('en-US')}</td>
                <td className='py-1'>{info.averageSegmentKm} km</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          <strong>Culling.</strong> Zoomed in, most countries are off screen. Each country&apos;s bounding box is
          computed once, and only the ones overlapping the view are drawn.
        </p>
        <p>
          <strong>Real data has the winding problem too.</strong> In the 1:10m file, three Maldives islets roughly 400m
          across were snapped to just three neighbouring points of the file&apos;s coordinate grid and came out wound
          counterclockwise. d3 read each one as &quot;the whole globe except this islet&quot;, so the Maldives covered
          the entire map. It&apos;s drawn 236th of 255 countries, on top of almost all of them, so it swallowed nearly
          every click. Since no country is bigger than a hemisphere, any polygon that comes out bigger is reversed when
          the data loads.
        </p>
        <p>
          <strong>Precision.</strong> <code>geoPath</code> rounds coordinates to 3 decimals by default, which is a whole
          pixel of error at 1000×. This tab uses {PATH_DIGITS}.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Where it runs out</h2>
        <p>
          1:10m is the most detailed Natural Earth data there is. Past about 80×, its 2.6 km segments are several pixels
          long and coastlines turn angular again, and by {MAX_ZOOM}× they&apos;re about 60 pixels long. Going deeper
          takes a different kind of data: tiles, cut and simplified separately for every zoom level, the way
          OpenStreetMap does it.
        </p>
      </div>
    </div>
  );
}
