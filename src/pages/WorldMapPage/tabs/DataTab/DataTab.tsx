import { useMemo, useState, type MouseEvent, type PointerEvent } from 'react';
import { geoGraticule10, geoPath, type GeoSphere } from 'd3-geo';
import Button from '@src/components/controls/Button';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import {
  COUNTRY_POPULATION_ROWS,
  getCountryPopulationRow,
  type CountryPopulationRow,
} from '../../logic/data/countryPopulation';
import { COUNTRY_RESOLUTIONS } from '../../logic/data/loadCountries';
import { PROJECTIONS } from '../../logic/projections';
import { fitProjectionToSphere } from '../../logic/utils/fitProjectionToSphere';
import { getCountryNameFromTarget } from '../../logic/utils/getCountryNameFromTarget';
import { getNextSelectedName } from '../../logic/utils/getNextSelectedName';
import { summarizeCountryFeature } from '../../logic/utils/summarizeCountryFeature';
import { isBoundsInView } from '../../logic/zoom/isBoundsInView';
import { pickResolution } from '../../logic/zoom/pickResolution';
import { useCountriesAtResolution } from '../../logic/zoom/useCountriesAtResolution';
import { MAX_ZOOM, MIN_ZOOM, useMapZoom } from '../../logic/zoom/useMapZoom';
import ColorLegend from './components/ColorLegend';
import { buildColorScale } from './logic/buildColorScale';
import {
  METRIC_OPTIONS,
  QUANTILE_CLASS_COUNT,
  SCALE_OPTIONS,
  type MetricName,
  type ScaleType,
} from './logic/constants';
import { describeCountryValue } from './logic/describeCountryValue';
import { getMetricValue } from './logic/getMetricValue';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;
const PATH_DIGITS = 4;

const SPHERE: GeoSphere = { type: 'Sphere' };

const PATH_GENERATOR = geoPath(
  fitProjectionToSphere({
    createProjection: PROJECTIONS.equalEarth.createProjection,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  }),
).digits(PATH_DIGITS);

const SPHERE_PATH = PATH_GENERATOR(SPHERE) ?? '';
const GRATICULE_PATH = PATH_GENERATOR(geoGraticule10()) ?? '';

const ACCENT_COLOR = '#e11d48';
const NO_DATA_COLOR = '#9ca3af';
const NO_DATA_PATTERN_ID = 'world-map-no-data';
const NO_DATA_HATCH_SIZE = 5;

export default function DataTab() {
  const [metric, setMetric] = useState<MetricName>('population');
  const [scaleType, setScaleType] = useState<ScaleType>('quantile');
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const { svgRef, transform, zoomIn, zoomOut, resetZoom } = useMapZoom({ width: MAP_WIDTH, height: MAP_HEIGHT });

  const requestedResolution = pickResolution({ zoomLevel: transform.k });
  const { countries, loadedResolution, isLoading } = useCountriesAtResolution({ resolution: requestedResolution });

  const colorScale = useMemo(() => {
    const values = COUNTRY_POPULATION_ROWS.map((row) => getMetricValue({ row, metric })).filter(
      (value) => value !== null,
    );
    const scale = buildColorScale({ values, scaleType });

    return scale;
  }, [metric, scaleType]);

  const countryShapes = useMemo(
    () =>
      countries
        .map((country) => ({
          country,
          name: country.properties.name,
          row: getCountryPopulationRow({ country }),
          path: PATH_GENERATOR(country),
          bounds: PATH_GENERATOR.bounds(country),
        }))
        .filter(({ path }) => path),
    [countries],
  );

  const visibleShapes = countryShapes.filter(({ bounds }) =>
    isBoundsInView({ bounds, transform, width: MAP_WIDTH, height: MAP_HEIGHT }),
  );

  const hoveredShape = countryShapes.find(({ name }) => name === hoveredName);
  const selectedShape = countryShapes.find(({ name }) => name === selectedName);

  const { k, x, y } = transform;
  const isZoomedIn = k > MIN_ZOOM;
  const canZoomIn = k < MAX_ZOOM;

  function getFill(row: CountryPopulationRow | null) {
    const value = row ? getMetricValue({ row, metric }) : null;

    if (value === null) return `url(#${NO_DATA_PATTERN_ID})`;

    const color = colorScale.getColor(value);

    return color;
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
        The zoomable countries from the previous tab, now colored by a number. Each country is joined to a row of
        population data, and its value picks a color. Countries with no matching row are hatched. Hover a country to see
        which row it was joined to.
      </p>

      <RadioTabs
        value={metric}
        setValue={setMetric}
        options={METRIC_OPTIONS}
        className='flex flex-wrap gap-px w-full'
      />
      <RadioTabs
        value={scaleType}
        setValue={setScaleType}
        options={SCALE_OPTIONS}
        className='flex flex-wrap gap-px w-full'
      />

      <ColorLegend legend={colorScale.legend} />

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
          {isLoading && ` (loading ${COUNTRY_RESOLUTIONS[requestedResolution].label}…)`}
        </span>
      </div>

      <div className='text-sm'>
        Hovering:{' '}
        {hoveredShape ? (
          <>
            <strong>{hoveredShape.name}</strong> →{' '}
            {describeCountryValue({ country: hoveredShape.country, row: hoveredShape.row, metric })}
          </>
        ) : (
          '—'
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role='img'
        aria-label='World countries colored by population, in the Equal Earth projection'
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className='cursor-grab active:cursor-grabbing touch-none border border-gray-300 dark:border-gray-600'
      >
        <defs>
          <pattern
            id={NO_DATA_PATTERN_ID}
            width={NO_DATA_HATCH_SIZE}
            height={NO_DATA_HATCH_SIZE}
            patternUnits='userSpaceOnUse'
            patternTransform={`scale(${1 / k}) rotate(45)`}
          >
            <line x1={0} y1={0} x2={0} y2={NO_DATA_HATCH_SIZE} stroke={NO_DATA_COLOR} strokeWidth={2} />
          </pattern>
        </defs>

        <g transform={`translate(${x} ${y}) scale(${k})`}>
          <path d={SPHERE_PATH} fill='none' stroke='currentColor' strokeWidth={1.5} vectorEffect='non-scaling-stroke' />
          <path
            d={GRATICULE_PATH}
            fill='none'
            stroke='currentColor'
            strokeWidth={0.5}
            strokeOpacity={0.25}
            vectorEffect='non-scaling-stroke'
          />
          {visibleShapes.map(({ name, path, row }) => (
            <path
              key={name}
              data-name={name}
              d={path!}
              fill={getFill(row)}
              stroke='currentColor'
              strokeWidth={0.5}
              strokeOpacity={0.5}
              vectorEffect='non-scaling-stroke'
            />
          ))}

          <g pointerEvents='none' fill='none' stroke={ACCENT_COLOR} vectorEffect='non-scaling-stroke'>
            {hoveredShape && hoveredName !== selectedName && (
              <path d={hoveredShape.path!} strokeWidth={1.5} vectorEffect='non-scaling-stroke' />
            )}
            {selectedShape && <path d={selectedShape.path!} strokeWidth={2.5} vectorEffect='non-scaling-stroke' />}
          </g>
        </g>
      </svg>

      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        {selectedShape ? (
          <div className='flex flex-wrap gap-4'>
            <div className='flex flex-col gap-1'>
              <div>
                Feature <strong>{selectedShape.name}</strong> (world-atlas,{' '}
                {COUNTRY_RESOLUTIONS[loadedResolution].label})
              </div>
              <pre className='font-mono text-xs p-3 rounded-md bg-gray-100 dark:bg-gray-800 overflow-auto'>
                {summarizeCountryFeature({ feature: selectedShape.country })}
              </pre>
            </div>
            <div className='flex flex-col gap-1'>
              <div>Joined row (Natural Earth)</div>
              <pre className='font-mono text-xs p-3 rounded-md bg-gray-100 dark:bg-gray-800 overflow-auto'>
                {selectedShape.row ? JSON.stringify(selectedShape.row, null, 2) : 'No row: the feature has no id.'}
              </pre>
            </div>
          </div>
        ) : (
          <div>Click a country to see its feature next to the row it was joined to.</div>
        )}

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Joining data to shapes</h2>
        <p>
          A world-atlas country carries only a name and an <code>id</code>: its ISO 3166-1 numeric code, like{' '}
          <code>&quot;250&quot;</code> for France. The numbers come from a separate table: Natural Earth&apos;s
          population estimates, one row per code, mostly for 2019 (17 of the 238 rows are from other years). Joining
          means looking up each feature&apos;s <code>id</code> in that table.
        </p>
        <p>
          <strong>Why codes and not names?</strong> The two sources disagree on 17 of the 174 names at 1:110m
          (&quot;Dem. Rep. Congo&quot; and &quot;Democratic Republic of the Congo&quot;), and on 43 of 239 at 1:10m.
        </p>
        <p>
          <strong>Codes have gaps too.</strong> Kosovo, Somaliland and Northern Cyprus have no ISO code, so they join to
          nothing and are hatched. Zoom in and 1:10m adds 13 more: small territories, reefs, military bases and disputed
          areas. A code can also be shared: past 3×, Ashmore and Cartier Islands appear with Australia&apos;s code, 036,
          and hovering them shows all of Australia&apos;s 25 million people.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Totals or density</h2>
        <p>
          Color by total population and big countries look important just for being big. Russia&apos;s 144 million
          people are spread over 17 million km², Bangladesh&apos;s 163 million over 137,000. People per km² takes the
          size out: 8.5 for Russia, 1,188 for Bangladesh. That&apos;s also why this tab uses Equal Earth: a
          country&apos;s share of the colored map matches its share of the globe, which Mercator would exaggerate near
          the poles.
        </p>
        <p>
          Areas are measured once with <code>geoArea</code> from the 1:10m outlines, so densities don&apos;t change as
          you zoom. For tiny countries those outlines are rough. Monaco measures 18 km² (it&apos;s about 2), and the
          Vatican was snapped to a zero-width sliver with no area at all, so it has no density.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>From numbers to colors</h2>
        <p>
          <strong>Linear</strong> spreads the colors evenly from 0 to the largest value. China and India have 1.4
          billion people each, so 165 of the 174 countries at 1:110m fall in the palest tenth of the range. Density is
          worse: Macao packs 21,420 people into each km², and all 174 fall in that palest tenth.
        </p>
        <p>
          <strong>Logarithmic</strong> gives every factor of 10 the same share of the colors, so 1 to 10 million is as
          far apart as 10 to 100 million. Countries spread out, but the extremes still stretch the ends: 30 people on
          South Georgia, 0.00037 per km² in Antarctica. Heard Island has 0 people, which a log scale can&apos;t place,
          so it gets the lightest color.
        </p>
        <p>
          <strong>Quantiles</strong> sort the values and split them into {QUANTILE_CLASS_COUNT} groups of equal size,
          one color each. Every color gets used equally, but a color no longer stands for an amount: the darkest
          population group runs from 42.8 million to China&apos;s 1.4 billion, a 33× spread.
        </p>
      </div>
    </div>
  );
}
