import { Chart } from '@tanstack/charts/react';
import Toggle from '@src/components/controls/Toggle';
import { useGlobeLogic } from './logic/useGlobeLogic';

export default function Globe() {
  const { definition, longitude, setLongitude, latitude, setLatitude, isSpinning, toggleIsSpinning } = useGlobeLogic();

  return (
    <div className='flex flex-col gap-3 w-full max-w-5xl'>
      <div className='text-xl font-bold'>3. Orthographic globe</div>
      <div className='text-sm opacity-70'>
        The same population data on an orthographic projection, layered over a sphere and a 10° graticule. Rotating just
        swaps the projection factory inside a memoized definition.
      </div>

      <div className='flex flex-wrap items-center gap-6'>
        <label className='flex items-center gap-2 text-sm'>
          Longitude {longitude.toFixed(0)}°
          <input
            type='range'
            min={-180}
            max={180}
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
            disabled={isSpinning}
          />
        </label>

        <label className='flex items-center gap-2 text-sm'>
          Latitude {latitude.toFixed(0)}°
          <input
            type='range'
            min={-90}
            max={90}
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
          />
        </label>

        <Toggle isChecked={isSpinning} setIsChecked={toggleIsSpinning} label='Spin' />
      </div>

      <Chart definition={definition} height={520} ariaLabel='World population on a rotatable globe' />
    </div>
  );
}
