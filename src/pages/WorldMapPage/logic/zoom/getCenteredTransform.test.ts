import { describe, expect, it } from 'vite-plus/test';
import { getCenteredTransform } from './getCenteredTransform';

describe('getCenteredTransform', () => {
  it('should leave the map untouched at 1x', () => {
    const expectedResult = { k: 1, x: 0, y: 0 };

    const actualResult = getCenteredTransform({ zoomLevel: 1, width: 960, height: 480 });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should keep the middle of the view in place when zooming in', () => {
    const expectedResult = [480, 240];

    const { k, x, y } = getCenteredTransform({ zoomLevel: 4, width: 960, height: 480 });
    const actualResult = [480 * k + x, 240 * k + y];

    expect(actualResult).toEqual(expectedResult);
  });
});
