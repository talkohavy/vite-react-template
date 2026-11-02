import { useState } from 'react';
import { geoGraticule10, geoPath, type GeoSphere } from 'd3-geo';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { WORLD_COUNTRIES } from '../../logic/data/worldCountries';
import { PROJECTION_OPTIONS, PROJECTIONS, type ProjectionName } from '../../logic/projections';
import { fitProjectionToSphere } from '../../logic/utils/fitProjectionToSphere';
import { summarizeCountryFeature } from './logic/summarizeCountryFeature';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;

const SPHERE: GeoSphere = { type: 'Sphere' };
const GRATICULE = geoGraticule10();

const FRANCE = WORLD_COUNTRIES.find((country) => country.properties.name === 'France')!;
const FRANCE_SUMMARY = summarizeCountryFeature({ feature: FRANCE });

export default function CountriesTab() {
  const [projectionName, setProjectionName] = useState<ProjectionName>('equirectangular');

  const { createProjection, label } = PROJECTIONS[projectionName];

  const projection = fitProjectionToSphere({ createProjection, width: MAP_WIDTH, height: MAP_HEIGHT });
  const pathGenerator = geoPath(projection);

  const spherePath = pathGenerator(SPHERE) ?? '';
  const graticulePath = pathGenerator(GRATICULE) ?? '';
  const countryPaths = WORLD_COUNTRIES.map((country) => ({
    name: country.properties.name,
    path: pathGenerator(country),
  })).filter(({ path }) => path);

  return (
    <div className='flex flex-col gap-4 w-full max-w-5xl'>
      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <p>
          Same sphere, graticule and projections. The single land shape is gone, replaced by{' '}
          <strong>{WORLD_COUNTRIES.length} countries</strong>. Each one is its own GeoJSON <code>Feature</code>, drawn
          as its own <code>&lt;path&gt;</code>. That&apos;s where the borders come from: each country now has its own
          outline.
        </p>
      </div>

      <RadioTabs
        value={projectionName}
        setValue={setProjectionName}
        options={PROJECTION_OPTIONS}
        className='flex flex-wrap gap-px w-full'
      />

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        overflow='visible'
        role='img'
        aria-label={`World countries and a 10 degree graticule in the ${label} projection`}
      >
        <path d={spherePath} fill='none' stroke='currentColor' strokeWidth={1.5} />
        <path d={graticulePath} fill='none' stroke='currentColor' strokeWidth={0.5} strokeOpacity={0.25} />
        {countryPaths.map(({ name, path }) => (
          <path key={name} d={path!} fill='none' stroke='currentColor' strokeWidth={0.75} />
        ))}
      </svg>

      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <h2 className='text-base font-bold text-gray-900 dark:text-white'>One country, as GeoJSON</h2>

        <p>
          Here is France, with its coordinates collapsed into counts. It&apos;s a <code>MultiPolygon</code> because it
          comes in three separate pieces: French Guiana in South America, the mainland, and Corsica. <code>id</code> is
          the ISO 3166-1 numeric country code, and <code>name</code> is the only property this dataset carries. Three
          places have no ISO code and therefore no <code>id</code>: N. Cyprus, Somaliland and Kosovo.
        </p>

        <pre className='font-mono text-xs p-3 rounded-md bg-gray-100 dark:bg-gray-800 overflow-auto'>
          {FRANCE_SUMMARY}
        </pre>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Where the countries come from</h2>

        <p>
          <code>world-atlas</code> ships <strong>TopoJSON</strong>, not GeoJSON. TopoJSON stores every border once, as
          an <em>arc</em>, and each country lists the arcs it&apos;s made of. In this file, 326 of the 595 arcs are
          shared by two neighbouring countries; most of the rest are coastlines.
        </p>

        <p>
          <code>topojson-client</code>&apos;s <code>feature()</code> converts it to GeoJSON, which has no way to share.
          Every shared border gets copied into both countries, so each inner border on the map above is actually drawn
          twice, once by each neighbour, exactly on top of itself.
        </p>

        <p>
          That&apos;s part of why the file grows from 108 KB as TopoJSON to 436 KB as GeoJSON. The other part is that
          TopoJSON stores coordinates as small integers instead of full-precision decimals. Even rounded to three
          decimals, the GeoJSON still comes out at about 193 KB.
        </p>
      </div>
    </div>
  );
}
