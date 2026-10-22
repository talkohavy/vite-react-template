import { useMemo } from 'react';
import { Chart } from '@tanstack/charts/react';
import { buildBubbleMapDefinition } from '../../logic/definitions/buildBubbleMapDefinition';
import { useMapZoom } from '../../logic/hooks/useMapZoom';
import ZoomControls from '../ZoomControls';

export default function BubbleMap() {
  const { containerRef, transform, zoomIn, zoomOut, resetZoom, isZoomedIn, canZoomIn } = useMapZoom();

  const definition = useMemo(() => buildBubbleMapDefinition({ transform }), [transform]);

  return (
    <div className='flex flex-col gap-3 w-full max-w-5xl'>
      <div className='text-xl font-bold'>2. Bubble map</div>
      <div className='text-sm opacity-70'>
        GeoJSON Point features become circles. The radius channel carries metro population through a square-root scale,
        so bubble area is proportional to population. Color is a categorical continent scale.
      </div>

      <ZoomControls
        zoomLevel={transform.k}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        isZoomedIn={isZoomedIn}
        canZoomIn={canZoomIn}
      />

      <div ref={containerRef} className='cursor-grab active:cursor-grabbing'>
        <Chart definition={definition} aspectRatio={1.8} ariaLabel='Largest metro areas by population' />
      </div>
    </div>
  );
}
