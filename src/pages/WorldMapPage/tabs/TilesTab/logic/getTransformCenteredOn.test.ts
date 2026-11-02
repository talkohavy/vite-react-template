import { describe, expect, it } from 'vite-plus/test';
import { createTileAlignedProjection } from './createTileAlignedProjection';
import { getTileZoom } from './getTileZoom';
import { getTransformCenteredOn } from './getTransformCenteredOn';

const VIEW = { baseWorldSize: 960, width: 960, height: 480 };
const EIFFEL_TOWER = { longitude: 2.2945, latitude: 48.8584 };

describe('getTransformCenteredOn', () => {
  it('should put the place in the middle of the view', () => {
    const transform = getTransformCenteredOn({ ...VIEW, ...EIFFEL_TOWER, tileZoom: 17 });
    const projection = createTileAlignedProjection({ transform, baseWorldSize: VIEW.baseWorldSize });

    const [x, y] = projection([EIFFEL_TOWER.longitude, EIFFEL_TOWER.latitude])!;

    expect(x).toBeCloseTo(480, 3);
    expect(y).toBeCloseTo(240, 3);
  });

  it('should zoom to where the requested tile level is drawn at its natural size', () => {
    const expectedResult = { tileZoom: 17, worldSize: 256 * 2 ** 17 };

    const transform = getTransformCenteredOn({ ...VIEW, ...EIFFEL_TOWER, tileZoom: 17 });
    const worldSize = VIEW.baseWorldSize * transform.k;
    const actualResult = { tileZoom: getTileZoom({ worldSize }), worldSize };

    expect(actualResult).toEqual(expectedResult);
  });
});
