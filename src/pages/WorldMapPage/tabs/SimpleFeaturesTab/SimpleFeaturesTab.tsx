import { useState, type SVGProps } from 'react';
import { geoArea, geoGraticule10, geoPath, type GeoSphere } from 'd3-geo';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import Toggle from '@src/components/controls/Toggle';
import { WORLD_COUNTRIES } from '../../logic/data/worldCountries';
import { PROJECTION_OPTIONS, PROJECTIONS, type ProjectionName } from '../../logic/projections';
import { fitProjectionToSphere } from '../../logic/utils/fitProjectionToSphere';
import { buildHandWrittenFeatures, type HandWrittenFeature } from './logic/buildHandWrittenFeatures';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;

const SPHERE: GeoSphere = { type: 'Sphere' };
const GRATICULE = geoGraticule10();
const SPHERE_AREA_IN_STERADIANS = 4 * Math.PI;

const ACCENT_COLOR = '#e11d48';

const FEATURE_STYLES: Record<HandWrittenFeature['geometry']['type'], SVGProps<SVGPathElement>> = {
  Point: { fill: ACCENT_COLOR, stroke: 'none' },
  LineString: { fill: 'none', stroke: ACCENT_COLOR, strokeWidth: 2 },
  Polygon: { fill: ACCENT_COLOR, fillOpacity: 0.3, stroke: ACCENT_COLOR, strokeWidth: 1.5 },
};

export default function SimpleFeaturesTab() {
  const [projectionName, setProjectionName] = useState<ProjectionName>('equirectangular');
  const [isTriangleReversed, setIsTriangleReversed] = useState(false);

  const { createProjection, label } = PROJECTIONS[projectionName];

  const projection = fitProjectionToSphere({ createProjection, width: MAP_WIDTH, height: MAP_HEIGHT });
  const pathGenerator = geoPath(projection);

  const spherePath = pathGenerator(SPHERE) ?? '';
  const graticulePath = pathGenerator(GRATICULE) ?? '';
  const countryPaths = WORLD_COUNTRIES.map((country) => ({
    name: country.properties.name,
    path: pathGenerator(country),
  })).filter(({ path }) => path);

  const handWrittenFeatures = buildHandWrittenFeatures({ isTriangleReversed });
  const featurePaths = handWrittenFeatures
    .map((feature) => ({
      name: feature.properties.name,
      path: pathGenerator(feature),
      style: FEATURE_STYLES[feature.geometry.type],
    }))
    .filter(({ path }) => path);

  const triangle = handWrittenFeatures.find((feature) => feature.geometry.type === 'Polygon')!;
  const triangleAreaInSteradians = geoArea(triangle);
  const triangleShareOfGlobe = ((triangleAreaInSteradians / SPHERE_AREA_IN_STERADIANS) * 100).toFixed(1);

  function toggleIsTriangleReversed() {
    setIsTriangleReversed((prevIsTriangleReversed) => !prevIsTriangleReversed);
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <p>
          GeoJSON&apos;s geometry types come from the <strong>Simple Features</strong> model. There are seven:{' '}
          <code>Point</code>, <code>MultiPoint</code>, <code>LineString</code>, <code>MultiLineString</code>,{' '}
          <code>Polygon</code>, <code>MultiPolygon</code> and <code>GeometryCollection</code>. The previous tabs already
          used three without saying so: the graticule is a <code>MultiLineString</code>, the land and France are{' '}
          <code>MultiPolygon</code>s, and most countries are plain <code>Polygon</code>s.
        </p>

        <p>
          So far every shape came from a dataset. Here, four features are written by hand and drawn in red on top of the
          countries:
        </p>
      </div>

      <pre className='font-mono text-xs p-3 rounded-md bg-gray-100 dark:bg-gray-800 overflow-auto'>
        {handWrittenFeatures
          .map(({ properties, geometry }) => `${properties.name}\n  ${JSON.stringify(geometry)}`)
          .join('\n')}
      </pre>

      <div className='flex flex-wrap items-center gap-4'>
        <RadioTabs
          value={projectionName}
          setValue={setProjectionName}
          options={PROJECTION_OPTIONS}
          className='flex flex-wrap gap-px'
        />

        <Toggle
          isChecked={isTriangleReversed}
          setIsChecked={toggleIsTriangleReversed}
          label='Wind the triangle counterclockwise (RFC 7946)'
        />
      </div>

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        overflow='visible'
        role='img'
        aria-label={`World countries with hand-written features in the ${label} projection`}
      >
        <path d={spherePath} fill='none' stroke='currentColor' strokeWidth={1.5} />
        <path d={graticulePath} fill='none' stroke='currentColor' strokeWidth={0.5} strokeOpacity={0.25} />
        {countryPaths.map(({ name, path }) => (
          <path key={name} d={path!} fill='none' stroke='currentColor' strokeWidth={0.75} strokeOpacity={0.6} />
        ))}
        {featurePaths.map(({ name, path, style }) => (
          <path key={name} d={path!} {...style} />
        ))}
      </svg>

      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Point</h2>
        <p>
          A single position: <code>[longitude, latitude]</code>, in that order. A point has no size, so{' '}
          <code>geoPath</code> draws it as a small circle, 4.5px in radius by default.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>LineString</h2>
        <p>
          Just two positions, and yet it bends. <code>d3-geo</code> treats every segment as a <em>great-circle arc</em>,
          the shortest route on the sphere, and adds points along it so it curves correctly in any projection. New York
          to Tokyo arcs up over northern Alaska, to about 70°N, for about 10,850 km. A line that looks straight on the
          equirectangular map, heading west across the Pacific, would be about 12,800 km. Where the arc crosses the 180°
          meridian, d3 cuts it and continues from the other edge of the map.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Polygon</h2>
        <p>
          A list of rings, each a list of positions where the last one repeats the first. On a sphere, any ring splits
          the surface in two, so the <em>order</em> of the positions decides which side is inside. <code>d3-geo</code>{' '}
          treats a clockwise ring as enclosing the small side. RFC 7946, the GeoJSON spec, asks for the opposite:
          exterior rings should be counterclockwise. Flip the toggle to wind the triangle the RFC way, and d3 fills
          everything <em>except</em> the triangle.
        </p>
        <p>
          Right now, d3 sees a polygon covering <strong>{triangleShareOfGlobe}%</strong> of the globe.
        </p>
      </div>
    </div>
  );
}
