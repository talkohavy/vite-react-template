import { describe, expect, it } from 'vite-plus/test';
import { getRotationAfterDrag } from './getRotationAfterDrag';

const RADIUS = 240;
const UNITS_PER_30_DEGREES = (RADIUS * Math.PI) / 6;

describe('getRotationAfterDrag', () => {
  it('should turn the globe east when dragging right, bringing the west into view', () => {
    const expectedResult = [30, 0];

    const actualResult = getRotationAfterDrag({
      rotation: [0, 0],
      deltaX: UNITS_PER_30_DEGREES,
      deltaY: 0,
      radius: RADIUS,
    });

    expect(actualResult[0]).toBeCloseTo(expectedResult[0]!);
    expect(actualResult[1]).toBeCloseTo(expectedResult[1]!);
  });

  it('should tilt the north toward the viewer when dragging down', () => {
    const expectedResult = -30;

    const [, actualResult] = getRotationAfterDrag({
      rotation: [0, 0],
      deltaX: 0,
      deltaY: UNITS_PER_30_DEGREES,
      radius: RADIUS,
    });

    expect(actualResult).toBeCloseTo(expectedResult);
  });

  it('should stop tilting at the pole', () => {
    const expectedResult = -90;

    const [, actualResult] = getRotationAfterDrag({
      rotation: [0, -80],
      deltaX: 0,
      deltaY: UNITS_PER_30_DEGREES,
      radius: RADIUS,
    });

    expect(actualResult).toBe(expectedResult);
  });

  it('should wrap the longitude past the antimeridian', () => {
    const expectedResult = -130;

    const [actualResult] = getRotationAfterDrag({
      rotation: [170, 0],
      deltaX: 2 * UNITS_PER_30_DEGREES,
      deltaY: 0,
      radius: RADIUS,
    });

    expect(actualResult).toBeCloseTo(expectedResult);
  });
});
