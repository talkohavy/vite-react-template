import { geoEqualEarth } from 'd3-geo';
import { describe, expect, it } from 'vite-plus/test';
import { applyZoomToProjection } from './applyZoomToProjection';

const TEL_AVIV: [number, number] = [34.78, 32.08];

function createProjection() {
  const projection = geoEqualEarth().scale(100).translate([300, 150]);

  return projection;
}

describe('applyZoomToProjection', () => {
  it('should leave projected points in place for the identity transform', () => {
    const expectedResult = createProjection()(TEL_AVIV);
    const zoomedProjection = applyZoomToProjection({ projection: createProjection(), transform: { k: 1, x: 0, y: 0 } });
    const actualResult = zoomedProjection(TEL_AVIV);

    expect(actualResult).toEqual(expectedResult);
  });

  it('should map a projected point p to k * p + translation', () => {
    const [unzoomedX, unzoomedY] = createProjection()(TEL_AVIV)!;

    const expectedResult = [2 * unzoomedX + 10, 2 * unzoomedY - 20];
    const zoomedProjection = applyZoomToProjection({
      projection: createProjection(),
      transform: { k: 2, x: 10, y: -20 },
    });
    const [actualX, actualY] = zoomedProjection(TEL_AVIV)!;

    expect(actualX).toBeCloseTo(expectedResult[0]!, 6);
    expect(actualY).toBeCloseTo(expectedResult[1]!, 6);
  });

  it('should multiply the projection scale by k', () => {
    const expectedResult = 300;
    const zoomedProjection = applyZoomToProjection({ projection: createProjection(), transform: { k: 3, x: 0, y: 0 } });
    const actualResult = zoomedProjection.scale();

    expect(actualResult).toEqual(expectedResult);
  });
});
