import { WORLD_LAND } from '../../logic/data/worldLand';
import { buildSvgPath } from './logic/buildSvgPath';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 480;

const landPath = buildSvgPath({ geoObject: WORLD_LAND, width: MAP_WIDTH, height: MAP_HEIGHT });

export default function BareMapTab() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <p>The smallest thing that still looks like a world map. It is made of exactly three pieces:</p>

        <ol className='list-decimal pl-6 flex flex-col gap-1'>
          <li>
            <strong>One GeoJSON feature.</strong> All the land on Earth merged into a single <code>MultiPolygon</code>,
            in longitude/latitude degrees.
          </li>
          <li>
            <strong>One projection.</strong> Equirectangular, the simplest one there is: longitude becomes x, latitude
            becomes y, then everything is scaled to fit the box.
          </li>
          <li>
            <strong>One SVG path.</strong> <code>d3-geo</code>&apos;s <code>geoPath</code> runs every coordinate through
            the projection and writes the result as an SVG <code>d</code> string.
          </li>
        </ol>

        <p>No countries, no ocean, no grid, no colors, no interaction.</p>
      </div>

      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role='img' aria-label='Outline of the world land masses'>
        <path d={landPath} fill='none' stroke='currentColor' strokeWidth={0.75} />
      </svg>
    </div>
  );
}
