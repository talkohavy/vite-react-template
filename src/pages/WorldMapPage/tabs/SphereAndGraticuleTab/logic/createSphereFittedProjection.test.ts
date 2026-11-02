import { describe, expect, it } from 'vite-plus/test';
import { createSphereFittedProjection } from './createSphereFittedProjection';

describe('createSphereFittedProjection', () => {
  it('should put the intersection of the equator and the prime meridian at the center', () => {
    const projection = createSphereFittedProjection({ width: 360, height: 180 });

    const expectedResult = [180, 90];
    const actualResult = projection([0, 0]);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should put the north-west corner of the globe at the top-left corner', () => {
    const projection = createSphereFittedProjection({ width: 360, height: 180 });

    const expectedResult = [0, 0];
    const actualResult = projection([-180, 90]);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should put the south-east corner of the globe at the bottom-right corner', () => {
    const projection = createSphereFittedProjection({ width: 360, height: 180 });

    const expectedResult = [360, 180];
    const actualResult = projection([180, -90]);

    expect(actualResult).toEqual(expectedResult);
  });
});
