import { describe, expect, it } from 'vite-plus/test';
import { getRouteBounds } from './getRouteBounds';

describe('getRouteBounds', () => {
  it('should return the south-west and north-east corners around all points', () => {
    const expectedResult = [
      [34.78, 32.05],
      [34.9, 32.2],
    ];

    const actualResult = getRouteBounds([
      [34.8, 32.05],
      [34.9, 32.1],
      [34.78, 32.2],
    ]);

    expect(actualResult).toEqual(expectedResult);
  });
});
