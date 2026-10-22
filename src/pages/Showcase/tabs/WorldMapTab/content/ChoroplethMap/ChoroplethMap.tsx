import { useMemo, useState } from 'react';
import { Chart } from '@tanstack/charts/react';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { FLAT_PROJECTION_OPTIONS, type FlatProjectionName } from '../../logic/constants';
import { buildChoroplethDefinition } from '../../logic/definitions/buildChoroplethDefinition';
import { formatPopulation } from '../../logic/utils/formatPopulation';
import type { PopulatedCountryFeature } from '../../logic/types';

export default function ChoroplethMap() {
  const [projectionName, setProjectionName] = useState<FlatProjectionName>('equalEarth');
  const [selectedCountry, setSelectedCountry] = useState<PopulatedCountryFeature | null>(null);

  const definition = useMemo(() => buildChoroplethDefinition({ projectionName }), [projectionName]);

  return (
    <div className='flex flex-col gap-3 w-full max-w-5xl'>
      <div className='text-xl font-bold'>1. Choropleth</div>
      <div className='text-sm opacity-70'>
        Each country is filled by its population through a threshold color scale. Gray countries have no data (they are
        not zero). Hover for a tooltip, click to select, and switch the projection to refit the same GeoJSON.
      </div>

      <RadioTabs
        value={projectionName}
        setValue={setProjectionName}
        options={FLAT_PROJECTION_OPTIONS}
        className='flex flex-wrap gap-px w-full'
      />

      <Chart
        definition={definition}
        aspectRatio={1.8}
        ariaLabel='World population by country'
        onSelect={(point) => setSelectedCountry(point?.datum ?? null)}
      />

      <div className='text-sm'>
        {selectedCountry
          ? `Selected: ${selectedCountry.properties.name} (${formatPopulation({ millions: selectedCountry.properties.population })})`
          : 'Click a country to select it.'}
      </div>
    </div>
  );
}
