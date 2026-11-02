import { describe, expect, it } from 'vite-plus/test';
import { buildColorScale } from './buildColorScale';
import { QUANTILE_CLASS_COUNT } from './constants';

const LIGHTEST_RGB = 'rgb(255, 255, 204)';
const MIDDLE_RGB = 'rgb(65, 182, 196)';
const DARKEST_RGB = 'rgb(37, 52, 148)';

describe('buildColorScale', () => {
  it('should run from the lightest color at 0 to the darkest at the max on a linear scale', () => {
    const { getColor } = buildColorScale({ values: [10, 100, 1000], scaleType: 'linear' });
    const expectedResult = [LIGHTEST_RGB, MIDDLE_RGB, DARKEST_RGB];

    const actualResult = [getColor(0), getColor(500), getColor(1000)];

    expect(actualResult).toEqual(expectedResult);
  });

  it('should put each power of ten at an equal step on a log scale', () => {
    const { legend } = buildColorScale({ values: [10, 100, 1000], scaleType: 'log' });
    const expectedResult = [
      { value: 10, offset: 0 },
      { value: 100, offset: expect.closeTo(0.5) },
      { value: 1000, offset: 1 },
    ];

    const actualResult = legend.kind === 'continuous' ? legend.ticks : [];

    expect(actualResult).toEqual(expectedResult);
  });

  it('should give zero the lightest color on a log scale', () => {
    const { getColor } = buildColorScale({ values: [0, 10, 1000], scaleType: 'log' });

    const actualResult = getColor(0);

    expect(actualResult).toBe(LIGHTEST_RGB);
  });

  it('should give each quantile class the same number of values', () => {
    const values = Array.from({ length: QUANTILE_CLASS_COUNT * 3 }, (_, index) => 2 ** index);
    const { getColor } = buildColorScale({ values, scaleType: 'quantile' });
    const expectedResult = Array.from({ length: QUANTILE_CLASS_COUNT }, () => 3);

    const countByColor = new Map<string, number>();
    values.forEach((value) => {
      const color = getColor(value);
      countByColor.set(color, (countByColor.get(color) ?? 0) + 1);
    });
    const actualResult = [...countByColor.values()];

    expect(actualResult).toEqual(expectedResult);
  });

  it('should start the first quantile class at the smallest value', () => {
    const values = Array.from({ length: QUANTILE_CLASS_COUNT * 3 }, (_, index) => index + 5);
    const { legend } = buildColorScale({ values, scaleType: 'quantile' });
    const expectedResult = 5;

    const actualResult = legend.kind === 'classes' ? legend.classes[0]?.lowerBound : null;

    expect(actualResult).toBe(expectedResult);
  });
});
