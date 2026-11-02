import { useState } from 'react';
import { geoGraticule10, geoPath, type GeoSphere } from 'd3-geo';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { WORLD_LAND } from '../../logic/data/worldLand';
import { PROJECTION_OPTIONS, PROJECTIONS, type ProjectionName } from '../../logic/projections';
import { fitProjectionToSphere } from '../../logic/utils/fitProjectionToSphere';
import { PROJECTION_DESCRIPTIONS } from './logic/constants';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;

const SPHERE: GeoSphere = { type: 'Sphere' };
const GRATICULE = geoGraticule10();

export default function ProjectionsTab() {
  const [projectionName, setProjectionName] = useState<ProjectionName>('equirectangular');

  const { createProjection } = PROJECTIONS[projectionName];
  const description = PROJECTION_DESCRIPTIONS[projectionName];

  const projection = fitProjectionToSphere({ createProjection, width: MAP_WIDTH, height: MAP_HEIGHT });
  const pathGenerator = geoPath(projection);

  const spherePath = pathGenerator(SPHERE) ?? '';
  const graticulePath = pathGenerator(GRATICULE) ?? '';
  const landPath = pathGenerator(WORLD_LAND) ?? '';

  return (
    <div className='flex flex-col gap-4 w-full max-w-5xl'>
      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <p>
          Same three layers: sphere, graticule, land. The data doesn&apos;t change at all. The only thing that changes
          is the <strong>projection</strong>, the function that turns a longitude/latitude pair into an x/y pixel.
        </p>

        <p>
          A sphere can&apos;t be flattened without tearing or stretching it, so every projection has to give something
          up. Some keep shapes, some keep areas, none keep both. The graticule shows you where the stretching happens.
        </p>
      </div>

      <RadioTabs
        value={projectionName}
        setValue={setProjectionName}
        options={PROJECTION_OPTIONS}
        className='flex flex-wrap gap-px w-full'
      />

      <p className='text-sm text-gray-600 dark:text-gray-300'>{description}</p>

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        overflow='visible'
        role='img'
        aria-label={`World land masses and a 10 degree graticule in the ${PROJECTIONS[projectionName].label} projection`}
      >
        <path d={spherePath} fill='none' stroke='currentColor' strokeWidth={1.5} />
        <path d={graticulePath} fill='none' stroke='currentColor' strokeWidth={0.5} strokeOpacity={0.25} />
        <path d={landPath} fill='none' stroke='currentColor' strokeWidth={0.75} />
      </svg>
    </div>
  );
}
