import { geoArea } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { loadCountries } from './loadCountries';
import { WORLD_COUNTRIES } from './worldCountries';

const HEMISPHERE_AREA = 2 * Math.PI;

describe('loadCountries', () => {
  it('should return the bundled 1:110m countries without loading anything', async () => {
    const actualResult = await loadCountries({ resolution: '110m' });

    expect(actualResult).toBe(WORLD_COUNTRIES);
  });

  it('should load the more detailed 1:50m countries', async () => {
    const countries = await loadCountries({ resolution: '50m' });

    const actualResult = countries.length;

    expect(actualResult).toEqual(241);
  });

  it('should not let the wrongly wound Maldives islets in 1:10m cover the whole globe', async () => {
    const countries = await loadCountries({ resolution: '10m' });
    const maldives = countries.find((country) => country.properties.name === 'Maldives')!;

    const actualResult = geoArea(maldives);

    expect(actualResult).toBeLessThan(HEMISPHERE_AREA);
  });

  it('should keep every 1:10m country smaller than a hemisphere', async () => {
    const countries = await loadCountries({ resolution: '10m' });

    const oversizedCountries = countries.filter((country) => geoArea(country) > HEMISPHERE_AREA);

    expect(oversizedCountries).toEqual([]);
  });

  it('should keep a loaded resolution instead of loading it again', async () => {
    const firstLoad = await loadCountries({ resolution: '50m' });
    const secondLoad = await loadCountries({ resolution: '50m' });

    expect(secondLoad).toBe(firstLoad);
  });
});
