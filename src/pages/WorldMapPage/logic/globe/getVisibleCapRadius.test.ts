import { describe, expect, it } from 'vite-plus/test';
import { getVisibleCapRadius } from './getVisibleCapRadius';

const VIEW = { radius: 240, width: 960, height: 480 };

describe('getVisibleCapRadius', () => {
  it('should show the whole facing hemisphere while the globe fits in the view', () => {
    const expectedResult = Math.PI / 2;

    const actualResult = getVisibleCapRadius({ ...VIEW, zoomLevel: 2 });

    expect(actualResult).toBe(expectedResult);
  });

  it('should shrink to a small cap once the globe is much bigger than the view', () => {
    const halfDiagonal = Math.hypot(960, 480) / 2;
    const expectedResult = Math.asin(halfDiagonal / (240 * 100));

    const actualResult = getVisibleCapRadius({ ...VIEW, zoomLevel: 100 });

    expect(actualResult).toBeCloseTo(expectedResult);
    expect((actualResult * 180) / Math.PI).toBeLessThan(1.5);
  });
});
