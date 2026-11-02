import { useState, type MouseEvent, type PointerEvent } from 'react';
import { geoGraticule10, geoPath, type GeoSphere } from 'd3-geo';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { WORLD_COUNTRIES } from '../../logic/data/worldCountries';
import { PROJECTION_OPTIONS, PROJECTIONS, type ProjectionName } from '../../logic/projections';
import { fitProjectionToSphere } from '../../logic/utils/fitProjectionToSphere';
import { getCountryNameFromTarget } from '../../logic/utils/getCountryNameFromTarget';
import { getNextSelectedName } from '../../logic/utils/getNextSelectedName';
import { summarizeCountryFeature } from '../../logic/utils/summarizeCountryFeature';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;

const SPHERE: GeoSphere = { type: 'Sphere' };
const GRATICULE = geoGraticule10();

const ACCENT_COLOR = '#e11d48';

export default function InteractionTab() {
  const [projectionName, setProjectionName] = useState<ProjectionName>('equirectangular');
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const { createProjection, label } = PROJECTIONS[projectionName];

  const projection = fitProjectionToSphere({ createProjection, width: MAP_WIDTH, height: MAP_HEIGHT });
  const pathGenerator = geoPath(projection);

  const spherePath = pathGenerator(SPHERE) ?? '';
  const graticulePath = pathGenerator(GRATICULE) ?? '';
  const countryPaths = WORLD_COUNTRIES.map((country) => ({
    name: country.properties.name,
    path: pathGenerator(country),
  })).filter(({ path }) => path);

  const hoveredPath = countryPaths.find(({ name }) => name === hoveredName)?.path;
  const selectedPath = countryPaths.find(({ name }) => name === selectedName)?.path;

  const selectedCountry = WORLD_COUNTRIES.find((country) => country.properties.name === selectedName);
  const selectedSummary = selectedCountry ? summarizeCountryFeature({ feature: selectedCountry }) : null;

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
      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <p>
          Back to just the countries (the hand-written features were a side trip). Now they react: hover a country to
          highlight it, click to select it, click it again or click the ocean to clear.
        </p>
      </div>

      <RadioTabs
        value={projectionName}
        setValue={setProjectionName}
        options={PROJECTION_OPTIONS}
        className='flex flex-wrap gap-px w-full'
      />

      <div className='text-sm'>
        Hovering: <strong>{hoveredName ?? '—'}</strong>
      </div>

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        overflow='visible'
        role='img'
        aria-label={`Interactive world countries in the ${label} projection`}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className='cursor-pointer'
      >
        <path d={spherePath} fill='none' stroke='currentColor' strokeWidth={1.5} />
        <path d={graticulePath} fill='none' stroke='currentColor' strokeWidth={0.5} strokeOpacity={0.25} />
        {countryPaths.map(({ name, path }) => (
          <path key={name} data-name={name} d={path!} fill='transparent' stroke='currentColor' strokeWidth={0.75} />
        ))}

        <g pointerEvents='none'>
          {hoveredPath && hoveredName !== selectedName && (
            <path d={hoveredPath} fill={ACCENT_COLOR} fillOpacity={0.25} stroke={ACCENT_COLOR} strokeWidth={1} />
          )}
          {selectedPath && (
            <path d={selectedPath} fill={ACCENT_COLOR} fillOpacity={0.6} stroke={ACCENT_COLOR} strokeWidth={1.5} />
          )}
        </g>
      </svg>

      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        {selectedSummary ? (
          <>
            <div>
              Selected: <strong>{selectedName}</strong>
            </div>
            <pre className='font-mono text-xs p-3 rounded-md bg-gray-100 dark:bg-gray-800 overflow-auto'>
              {selectedSummary}
            </pre>
          </>
        ) : (
          <div>Click a country to select it.</div>
        )}

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>How it works</h2>

        <p>
          Every country is a real DOM element, so the browser already knows which one is under the pointer. No geometry
          math is needed to find it.
        </p>

        <p>
          <strong>Gotcha:</strong> with <code>fill=&quot;none&quot;</code>, as in the previous tabs, a path only reacts
          on its outline. SVG&apos;s default <code>pointer-events</code> value, <code>visiblePainted</code>, only hits
          the parts that are actually painted. The countries here use <code>fill=&quot;transparent&quot;</code> instead:
          invisible, but painted, so the whole interior responds.
        </p>

        <p>
          <strong>One listener for {WORLD_COUNTRIES.length} countries.</strong> The handlers sit on the{' '}
          <code>&lt;svg&gt;</code>, and each country path carries a <code>data-name</code>, so <code>event.target</code>{' '}
          says which one it was. This is called event delegation.
        </p>

        <p>
          <strong>SVG has no z-index.</strong> Elements paint in document order, so neighbours drawn later would paint
          over part of a highlighted outline. The hovered and selected countries are drawn a second time, in a layer on
          top of everything. That layer has <code>pointer-events=&quot;none&quot;</code>, otherwise the copy would
          become the event target instead of the real country underneath it.
        </p>
      </div>
    </div>
  );
}
