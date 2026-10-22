import { Chart } from '@tanstack/charts/react';
import { bubbleMapDefinition } from '../../logic/definitions/bubbleMapDefinition';

export default function BubbleMap() {
  return (
    <div className='flex flex-col gap-3 w-full max-w-5xl'>
      <div className='text-xl font-bold'>2. Bubble map</div>
      <div className='text-sm opacity-70'>
        GeoJSON Point features become circles. The radius channel carries metro population through a square-root scale,
        so bubble area is proportional to population. Color is a categorical continent scale.
      </div>

      <Chart definition={bubbleMapDefinition} aspectRatio={1.8} ariaLabel='Largest metro areas by population' />
    </div>
  );
}
