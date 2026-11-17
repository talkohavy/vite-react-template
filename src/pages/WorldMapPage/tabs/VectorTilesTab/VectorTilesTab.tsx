import VectorTileMap from './components/VectorTileMap';
import { MAX_VECTOR_TILE_LEVEL } from './logic/constants';

export default function VectorTilesTab() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <p className='text-sm text-gray-600 dark:text-gray-300'>
        The Tiles tab downloaded pictures. These tiles hold the shapes instead: roads, buildings, water and place names
        as geometry, which MapLibre draws with WebGL at your screen&apos;s full pixel density. Nothing gets stretched,
        so lines and labels stay crisp at every zoom. Drag to pan, scroll or pinch to zoom, and right-drag (or Ctrl +
        drag) to rotate and tilt.
      </p>

      <VectorTileMap />

      <div className='text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-2'>
        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Shapes, not pixels</h2>
        <p>
          A vector tile is a small binary file (<code>.pbf</code>) covering the same z/x/y square as a picture tile, but
          holding the features inside it, sorted into layers like <code>water</code>, <code>transportation</code> and{' '}
          <code>building</code>. The browser decodes them in web workers and turns them into triangles for the GPU,
          redrawing the whole view every frame. Zooming between levels just redraws the same shapes bigger, which is why
          there&apos;s no blurry in-between.
        </p>
        <p>
          <strong>Overzooming.</strong> OpenFreeMap cuts its tiles down to level {MAX_VECTOR_TILE_LEVEL}. Past that,
          MapLibre keeps the level {MAX_VECTOR_TILE_LEVEL} tiles and draws them larger. With pictures that would mean
          enlarging pixels; with shapes it only means more detail than the data has, and the edges stay sharp.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>The style is separate from the data</h2>
        <p>
          The colors, line widths, fonts and which layers show at which zoom all live in a style file, not in the tiles.
          The four styles above paint the same OpenMapTiles data, so switching one re-paints the map without new
          geometry. That&apos;s how sites like easy.co.il get their own look: a custom style over shared vector data.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Labels</h2>
        <p>
          Place names are drawn live, not baked into images: each label is placed, rotated along its road and dropped if
          it would collide with another. Hebrew and Arabic names are shaped and laid out right to left by MapLibre
          itself. Jump to Ra&apos;anana to see them.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Directions</h2>
        <p>
          The routes come from{' '}
          <a href='https://project-osrm.org/' target='_blank' rel='noreferrer' className='underline'>
            OSRM
          </a>{' '}
          on FOSSGIS&apos;s servers, the same ones behind openstreetmap.org&apos;s directions, with one server each for
          walking, cycling and driving. Each answer is the best route plus any reasonable alternatives as GeoJSON lines.
          The map draws them as one more source in the style: a white outline and a colored line, slotted above the
          roads and below the labels. Drag either pin or click the map to move the destination, and click a grey route
          to pick it.
        </p>
        <p>
          There&apos;s no bus option: public transport routing needs timetables (GTFS feeds) and a different kind of
          engine, such as OpenTripPlanner.
        </p>

        <h2 className='text-base font-bold text-gray-900 dark:text-white'>Where the tiles come from</h2>
        <p>
          The tiles, styles and fonts come from{' '}
          <a href='https://openfreemap.org/' target='_blank' rel='noreferrer' className='underline'>
            OpenFreeMap
          </a>
          , which serves OpenStreetMap data with no API key or usage limits. The attribution in the corner of the map
          comes with each style.
        </p>
      </div>
    </div>
  );
}
