import { describe, expect, it } from 'vite-plus/test';
import { formatCompactNumber, formatMetricValue } from './formatMetricValue';

describe('formatMetricValue', () => {
  it('should format a population with thousands separators', () => {
    const expectedResult = '67,059,887 people';

    const actualResult = formatMetricValue({ value: 67059887, metric: 'population' });

    expect(actualResult).toBe(expectedResult);
  });

  it('should round a density of 10 or more to a whole number', () => {
    const expectedResult = '1,188 people per km²';

    const actualResult = formatMetricValue({ value: 1188.24, metric: 'density' });

    expect(actualResult).toBe(expectedResult);
  });

  it('should keep 2 significant digits for a density below 10', () => {
    const expectedResult = '0.00037 people per km²';

    const actualResult = formatMetricValue({ value: 0.000366, metric: 'density' });

    expect(actualResult).toBe(expectedResult);
  });
});

describe('formatCompactNumber', () => {
  it('should shorten large numbers', () => {
    const expectedResult = '1.4B';

    const actualResult = formatCompactNumber({ value: 1397715000 });

    expect(actualResult).toBe(expectedResult);
  });
});
