import { describe, expect, it } from 'vite-plus/test';
import { loadCountries } from './loadCountries';
import { WORLD_COUNTRIES } from './worldCountries';

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

  it('should keep a loaded resolution instead of loading it again', async () => {
    const firstLoad = await loadCountries({ resolution: '50m' });
    const secondLoad = await loadCountries({ resolution: '50m' });

    expect(secondLoad).toBe(firstLoad);
  });
});
