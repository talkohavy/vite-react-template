import { describe, expect, it } from 'vite-plus/test';
import { getMetricValue } from './getMetricValue';

const ROW = { isoCode: '999', name: 'Testland', population: 1000, year: 2019, areaKm2: 50 };

describe('getMetricValue', () => {
  it('should return the population as is', () => {
    const expectedResult = 1000;

    const actualResult = getMetricValue({ row: ROW, metric: 'population' });

    expect(actualResult).toBe(expectedResult);
  });

  it('should divide the population by the area for density', () => {
    const expectedResult = 20;

    const actualResult = getMetricValue({ row: ROW, metric: 'density' });

    expect(actualResult).toBe(expectedResult);
  });

  it('should return null for density when the area is zero', () => {
    const rowWithoutArea = { ...ROW, areaKm2: 0 };

    const actualResult = getMetricValue({ row: rowWithoutArea, metric: 'density' });

    expect(actualResult).toBeNull();
  });
});
