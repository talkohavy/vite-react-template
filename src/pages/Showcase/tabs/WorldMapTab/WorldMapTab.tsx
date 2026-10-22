import BubbleMap from './content/BubbleMap';
import ChoroplethMap from './content/ChoroplethMap';
import Globe from './content/Globe';

export default function WorldMapTab() {
  return (
    <>
      <div className='text-sm opacity-70 max-w-5xl'>
        World maps built with <code>geoShape</code> from <code>@tanstack/charts/geo</code>. Country boundaries come from{' '}
        <code>world-atlas</code> (Natural Earth, 1:110m), converted from TopoJSON to GeoJSON with{' '}
        <code>topojson-client</code>. Population figures are approximate 2023 estimates.
      </div>

      <ChoroplethMap />
      <BubbleMap />
      <Globe />
    </>
  );
}
